// config/multer.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js'; // Import Cloudinary config

// Configure Cloudinary storage for Multer with dynamic folders
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder = 'misc'; // Default folder

    // Assign folder based on field name
    if (file.fieldname === 'coverImage') {
      folder = 'news';
    } else if (file.fieldname === 'image' || file.fieldname === 'logo') {
      folder = 'offers';
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

// Initialize Multer with the Cloudinary storage
const upload = multer({ storage: storage });

export default upload;
