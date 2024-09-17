import News from '../models/News.js';
import cloudinary from '../config/cloudinary.js';

// Add News
export const addNews = async (req, res) => {
  const { title, summary, source, link } = req.body;
  try {
    // Multer automatically stores the file in Cloudinary and adds `path` and other metadata in `req.file`
    let coverImageUrl = null;
    
    if (req.file) {
      // If a cover image was uploaded, use the path provided by Cloudinary
      coverImageUrl = req.file.path;  // The Cloudinary URL of the uploaded image
    }

    // Create a new News document with the data
    const news = new News({
      title,
      summary,
      source,
      link,
      coverImage: coverImageUrl,  // Save the Cloudinary image URL if available
      addedBy: req.user.id,  // Assuming `req.user` holds the authenticated user's info
    });

    // Save the news to the database
    await news.save();

    // Send the saved news as a response
    res.status(201).json(news);
  } catch (err) {
    console.error(err);  // Log the error for debugging
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
