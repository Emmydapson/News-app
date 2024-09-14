import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};


// Middleware to check if the user is an admin

export const isSuperAdmin = async (req, res, next) => {
  try {
    console.log('User ID from token:', req.user.id);
    console.log('User role from token:', req.user.role);
    
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'superadmin') {
      return res.status(403).json({ msg: 'Access denied, superadmin only' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
};



