import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  coverImage: { type: String },  // Make this optional
  summary: { type: String, required: true },
  source: { type: String, required: true },
  link: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin adding the news
});

// Check if model already exists to prevent OverwriteModelError
const News = mongoose.models.News || mongoose.model('News', newsSchema);
export default News;
