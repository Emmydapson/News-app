import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  logo: { type: String, required: true },
  link: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin adding the offer
});

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
