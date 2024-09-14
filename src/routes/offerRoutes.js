import express from 'express';
import { addOffer, getOffers, deleteOffer } from '../controllers/offerController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();


// Offer Routes
router.post('/offers', authenticateToken, addOffer);  // Admins only
router.get('/offers', getOffers);  // Public
router.delete('/offers/:id', authenticateToken, deleteOffer);

export default router;