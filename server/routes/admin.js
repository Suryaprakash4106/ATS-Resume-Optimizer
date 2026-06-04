const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');

// Get all users (admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -otp')
      .sort({ createdAt: -1 });
    
    if (!users) {
      users = [];
    }
    
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users', 
      success: false,
      users: [] 
    });
  }
});

// Get user activity
router.get('/user-activity', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email loginHistory createdAt lastOptimized atsScore')
      .sort({ lastOptimized: -1 });
    
    const activities = users.map(user => ({
      id: user._id,
      name: user.name || 'Unknown',
      email: user.email || '',
      logins: user.loginHistory?.length || 0,
      lastLogin: user.loginHistory && user.loginHistory.length > 0 
        ? user.loginHistory[user.loginHistory.length - 1]?.timestamp 
        : null,
      registeredAt: user.createdAt || null,
      lastOptimized: user.lastOptimized || null,
      atsScore: user.atsScore || 0
    }));
    
    res.json({ success: true, activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ 
      message: error.message, 
      success: false,
      activities: [] 
    });
  }
});

// Get dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    // Calculate average ATS score safely
    const usersWithScores = await User.find({ atsScore: { $gt: 0 } }).select('atsScore');
    let averageATSScore = 0;
    if (usersWithScores.length > 0) {
      const totalScore = usersWithScores.reduce((sum, user) => sum + (user.atsScore || 0), 0);
      averageATSScore = Math.round(totalScore / usersWithScores.length);
    }
    
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt atsScore');
    
    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        adminCount: adminCount || 0,
        userCount: userCount || 0,
        verifiedUsers: verifiedUsers || 0,
        averageATSScore: averageATSScore || 0,
        recentUsers: recentUsers || [],
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      message: error.message, 
      success: false,
      stats: {
        totalUsers: 0,
        adminCount: 0,
        userCount: 0,
        verifiedUsers: 0,
        averageATSScore: 0,
        recentUsers: [],
      }
    });
  }
});

// Delete user (admin only)
router.delete('/user/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    res.json({ message: 'User deleted successfully', success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get optimizer history (resume optimization history)
router.get('/optimizer-history', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ lastOptimized: { $ne: null } })
      .select('name email atsScore lastOptimized atsSuggestions')
      .sort({ lastOptimized: -1 })
      .limit(20);
    
    const history = (users || []).map(user => ({
      name: user.name || 'Unknown',
      email: user.email || '',
      score: user.atsScore || 0,
      optimizedAt: user.lastOptimized || null,
      suggestions: (user.atsSuggestions && user.atsSuggestions.slice(0, 3)) || [],
    }));
    
    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching optimizer history:', error);
    res.status(500).json({ 
      message: error.message, 
      success: false,
      history: [] 
    });
  }
});

module.exports = router;