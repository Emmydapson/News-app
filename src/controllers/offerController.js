import Offer from '../models/Offer.js';
import cloudinary from '../config/cloudinary.js';


// Add Offer
export const addOffer = async (req, res) => {
  const { title, brand, link } = req.body;  // Remove image and logo from req.body since they will be uploaded separately
  try {
    // Handle image upload
    let imageUrl = null;
    let logoUrl = null;
    
    if (req.files && req.files.image) {
      const imageResult = await cloudinary.uploader.upload(req.files.image[0].path);  // Upload image to Cloudinary
      imageUrl = imageResult.secure_url;
    }

    if (req.files && req.files.logo) {
      const logoResult = await cloudinary.uploader.upload(req.files.logo[0].path);  // Upload logo to Cloudinary
      logoUrl = logoResult.secure_url;
    }

    const offer = new Offer({
      title,
      brand,
      image: imageUrl,
      logo: logoUrl,
      link,
      addedBy: req.user.id,  // Assuming the user is an admin and authenticated
    });

    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding offer', error: err.message });
  }
};

// Get all offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ date: -1 });
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching offers', error: err.message });
  }
};

// Delete Offer
export const deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    await Offer.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Offer deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting offer', error: err.message });
  }
};
