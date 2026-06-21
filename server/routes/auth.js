const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendOTPEmail } = require('../utils/email');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists', success: false });
    }
    
    // Check if this email is admin
    const isAdmin = email === process.env.ADMIN_EMAIL;
    
    const user = await User.create({
      name,
      email,
      password,
      role: isAdmin ? 'admin' : 'user',
    });
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await user.save();
    
    // Send OTP email
    await sendOTPEmail(email, otp);
    
    res.status(201).json({
      message: 'Registration successful! Please verify OTP sent to your email',
      success: true,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified', success: false });
    }
    
    if (user.otp.code !== otp || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP', success: false });
    }
    
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    
    const token = generateToken(user._id);
    
    res.json({
      message: 'Email verified successfully',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }
    
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }
    
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first', success: false });
    }
    
    // Log login activity
    user.loginHistory.push({
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    await user.save();
    
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified', success: false });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await user.save();
    
    await sendOTPEmail(email, otp);
    
    res.json({ message: 'OTP resent successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;