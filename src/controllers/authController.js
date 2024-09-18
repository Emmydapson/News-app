import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Registration
export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase(); // Normalize email to lowercase
    let user = await User.findOne({ email: normalizedEmail });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Check if there's already a superadmin
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    console.log('Superadmin user:', existingSuperAdmin);

    // If no superadmin exists, assign this user the superadmin role
    const role = existingSuperAdmin ? 'user' : 'superadmin';

    // No need to hash password here; it's handled by the pre-save hook
    user = new User({ firstName, lastName, email: normalizedEmail, password, role });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully', user: { firstName, lastName, email: normalizedEmail, role } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Generate token including user role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: normalizedEmail, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};





// Forgot Password (Send OTP)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const normalizedEmail = email.toLowerCase(); // Normalize email to lowercase
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    user.resetPasswordToken = otp.toString();
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({ msg: 'Email not sent', error: error.message });
      }
      res.status(200).json({ msg: 'OTP sent to your email' });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: otp.toString(),
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log('User input OTP:', otp);
      console.log('Stored OTP:', user.resetPasswordToken);

      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Generate a temporary JWT token with the user's ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' }); // 15 min expiration for reset token

    res.status(200).json({ msg: 'OTP verified', resetToken: token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Reset Password
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Verify the reset token and extract the user ID
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Set the new password directly, the pre-save hook will handle hashing
    user.password = newPassword;

    // Clear the OTP fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ msg: 'Password reset successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ msg: 'Reset token expired' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


