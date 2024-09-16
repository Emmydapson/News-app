import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String },  // Not required, since there may be offers without images
  logo: { type: String },   // Not required
  link: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin adding the offer
});

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
export default Offer;
