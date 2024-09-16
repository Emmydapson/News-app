import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ 
      msg: 'Authorization denied. No token provided.', 
      error: 'Token missing in request headers' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      msg: 'Invalid token. Authorization failed.', 
      error: 'The provided token is either expired or malformed' 
    });
  }
};

// Middleware to check if the user is a superadmin
export const isSuperAdmin = async (req, res, next) => {
  try {
    console.log('User ID from token:', req.user.id);
    console.log('User role from token:', req.user.role);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        msg: 'User not found. Invalid credentials.',
        error: 'The user associated with this token no longer exists'
      });
    }

    if (user.role !== 'superadmin') {
      return res.status(403).json({
        msg: 'Access denied. Insufficient privileges.',
        error: 'This action can only be performed by a superadmin'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      msg: 'Internal server error',
      error: error.message
    });
  }
};
