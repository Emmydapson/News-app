import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure destination directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'misc'; // Default folder

    if (file.fieldname === 'coverImage') {
      folder = 'news';
    } else if (file.fieldname === 'image' || file.fieldname === 'logo') {
      folder = 'offers';
    }

    const dirPath = path.join(__dirname, 'uploads', folder);
    ensureDirectoryExists(dirPath); // Ensure the directory exists
    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// Configure Multer with fileFilter logic
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit to 10MB
  fileFilter: (req, file, cb) => {
    // Check if the file's mimetype starts with 'image/'
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file format'), false); // Reject the file
    }
  }
});




export default upload;
