import express from 'express';
import { addNews, getNews, deleteNews } from '../controllers/newsController.js';
import { authenticateToken, isAdminOrSuperAdmin } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// News Routes
router.post('/news', authenticateToken, isAdminOrSuperAdmin, upload.single('coverImage'), addNews);  // Admins only, with file upload
router.get('/news', getNews);  // Public
router.delete('/news/:id', authenticateToken, isAdminOrSuperAdmin, deleteNews);  // Admins only

export default router;
