import express from 'express';
import { addOffer, getOffers, deleteOffer } from '../controllers/offerController.js';
import { authenticateToken, isSuperAdmin } from '../middlewares/authMiddleware.js';  // Ensure only superadmins can add offers
import upload from '../config/multer.js';  // Import the multer config

const router = express.Router();

// Offer Routes
router.post('/offers', authenticateToken, isSuperAdmin, upload.fields([
  { name: 'image', maxCount: 1 },  // Handle image upload
  { name: 'logo', maxCount: 1 }    // Handle logo upload
]), addOffer);  // Admins only

router.get('/offers', getOffers);  // Public
router.delete('/offers/:id', authenticateToken, isSuperAdmin, deleteOffer);  // Admins only

export default router;
