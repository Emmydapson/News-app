import News from '../models/News.js';
import cloudinary from '../config/cloudinary.js';

// Add News
export const addNews = async (req, res) => {
  const { title, summary, content, source, link, coverImage } = req.body;
  try {
    // Handle file upload if a cover image is provided
    let coverImageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);  // Upload to Cloudinary
      coverImageUrl = result.secure_url;  // Get the uploaded image URL
    }
    const news = new News({
      title,
      summary,
      content,
      source,
      link,
      coverImage:coverImageUrl, // Use the secure URL from Cloudinary
      addedBy: req.user.id,  // assuming the user is an admin and authenticated
    });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding news', error: err.message });
  }
};

// Get all news
export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching news', error: err.message });
  }
};

// Delete News
export const deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    await News.findByIdAndDelete(id);
    res.status(200).json({ msg: 'News deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting news', error: err.message });
  }
};
