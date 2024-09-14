import express from 'express';
import { addNews, getNews, deleteNews } from '../controllers/newsController.js';
import { authenticateToken, isSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/// News Routes
router.post('/news', authenticateToken, isSuperAdmin, addNews);  // Admins only
router.get('/news', getNews);  // Public
router.delete('/news/:id', authenticateToken, isSuperAdmin, deleteNews); 

export default router;