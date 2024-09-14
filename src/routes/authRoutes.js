import { Router } from 'express';
import { register, login, forgotPassword } from '../controllers/authController.js'; 
import { authenticateToken, isSuperAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

/// Only a superadmin can promote a user to an admin
router.put('/user/:id/promote', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });

      user.role = 'admin'; // Promote the user to admin
      await user.save();

      res.status(200).json({ msg: 'User promoted to admin' });
  } catch (error) {
      res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

export default router;
