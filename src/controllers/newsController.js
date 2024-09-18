import News from '../models/News.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';


// Add News
export const addNews = async (req, res) => {
  const { title, summary, source, link } = req.body;

  console.log('Incoming request data:', { title, summary, source, link });

  try {
    let coverImageUrl = null;

    if (req.file) {
      console.log('File received from multer:', req.file);

      const filePath = req.file.path;

      try {
        console.log('Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'news',
          format: 'auto',
        });

        coverImageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({ msg: 'Error uploading image', error: uploadError.message });
      }

      // Asynchronous file deletion
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting local file:', err);
        }
      });
    }

    const news = new News({
      title,
      summary,
      source,
      link,
      coverImage: coverImageUrl,
      addedBy: req.user.id,
    });

    console.log('News object before saving:', news);

    await news.save();

    console.log('News successfully saved:', news);

    res.status(201).json(news);
  } catch (err) {
    console.error('Error adding news:', err);
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
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({ msg: 'News not found' });
    }
    res.status(200).json({ msg: 'News deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting news', error: err.message });
  }
};
