const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, resumeData } = req.body;
    
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (resumeData) user.resumeData = resumeData;
    user.updatedAt = new Date();
    await user.save();
    
    res.json({ message: 'Profile updated', success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get user history
router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loginHistory lastOptimized atsScore atsSuggestions createdAt');
    res.json({ success: true, history: user });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;