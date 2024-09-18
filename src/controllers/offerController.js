import Offer from '../models/Offer.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Add Offer
export const addOffer = async (req, res) => {
  const { title, brand, link } = req.body;

  // Log incoming request data
  console.log('Incoming request data:', { title, brand, link });

  try {
    let imageUrl = null;
    let logoUrl = null;

    // Handle file uploads for image and logo
    if (req.files) {
      if (req.files.image) {
        try {
          const imageFilePath = req.files.image[0].path;
          const imageResult = await cloudinary.uploader.upload(imageFilePath, {
            folder: 'offers',
            format: 'auto',
          });
          imageUrl = imageResult.secure_url;

          // Delete the local image file asynchronously
          fs.unlink(imageFilePath, (err) => {
            if (err) {
              console.error('Error deleting local image file:', err);
            }
          });
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          return res.status(500).json({ msg: 'Error uploading image', error: uploadError.message });
        }
      }

      if (req.files.logo) {
        try {
          const logoFilePath = req.files.logo[0].path;
          const logoResult = await cloudinary.uploader.upload(logoFilePath, {
            folder: 'offers',
            format: 'auto',
          });
          logoUrl = logoResult.secure_url;

          // Delete the local logo file asynchronously
          fs.unlink(logoFilePath, (err) => {
            if (err) {
              console.error('Error deleting local logo file:', err);
            }
          });
        } catch (uploadError) {
          console.error('Error uploading logo to Cloudinary:', uploadError);
          return res.status(500).json({ msg: 'Error uploading logo', error: uploadError.message });
        }
      }
    }

    // Create a new Offer document with the data
    const offer = new Offer({
      title,
      brand,
      image: imageUrl,
      logo: logoUrl,
      link,
      addedBy: req.user.id, // Assuming `req.user` holds the authenticated user's info
    });

    // Log the Offer object before saving
    console.log('Offer object before saving:', offer);

    // Save the offer to the database
    await offer.save();

    // Log the successful save
    console.log('Offer successfully saved:', offer);

    // Send the saved offer as a response
    res.status(201).json(offer);
  } catch (err) {
    console.error('Error adding offer:', err);
    res.status(500).json({ msg: 'Error adding offer', error: err.message });
  }
};

// Get all offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ date: -1 }); // Fetch all offers sorted by date
    res.status(200).json(offers); // Send the offers back to the client
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching offers', error: err.message });
  }
};

// Delete Offer
export const deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOffer = await Offer.findByIdAndDelete(id); // Find and delete the offer by ID
    if (!deletedOffer) {
      return res.status(404).json({ msg: 'Offer not found' });
    }
    res.status(200).json({ msg: 'Offer deleted' }); // Confirm deletion
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting offer', error: err.message });
  }
};
