import Offer from '../models/Offer.js';

// Add Offer
export const addOffer = async (req, res) => {
  const { title, brand, link } = req.body;
  try {
    // Handle file uploads for image and logo
    let imageUrl = null;
    let logoUrl = null;

    // If the `image` file exists, upload it to Cloudinary
    if (req.files && req.files.image) {
      const imageResult = await cloudinary.uploader.upload(req.files.image[0].path);  // Upload the image to Cloudinary
      imageUrl = imageResult.secure_url;  // Get the secure URL of the uploaded image
    }

    // If the `logo` file exists, upload it to Cloudinary
    if (req.files && req.files.logo) {
      const logoResult = await cloudinary.uploader.upload(req.files.logo[0].path);  // Upload the logo to Cloudinary
      logoUrl = logoResult.secure_url;  // Get the secure URL of the uploaded logo
    }

    // Create a new Offer document in the database
    const offer = new Offer({
      title,
      brand,
      image: imageUrl,  // Store the image URL from Cloudinary
      logo: logoUrl,    // Store the logo URL from Cloudinary
      link,
      addedBy: req.user.id,  // Assuming the user is authenticated and admin
    });

    // Save the offer to the database
    await offer.save();

    // Return the newly created offer
    res.status(201).json(offer);
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ msg: 'Error adding offer', error: err.message });
  }
};

// Get all offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ date: -1 });  // Fetch all offers sorted by date
    res.status(200).json(offers);  // Send the offers back to the client
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching offers', error: err.message });
  }
};

// Delete Offer
export const deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    await Offer.findByIdAndDelete(id);  // Find and delete the offer by ID
    res.status(200).json({ msg: 'Offer deleted' });  // Confirm deletion
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting offer', error: err.message });
  }
};
