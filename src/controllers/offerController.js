import Offer from '../models/Offer.js';

// Add Offer
export const addOffer = async (req, res) => {
  const { title, brand, image, logo, link } = req.body;
  try {
    const offer = new Offer({
      title,
      brand,
      image,
      logo,
      link,
      addedBy: req.user.id, // Admin adding the offer
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
