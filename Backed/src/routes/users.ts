import express from 'express';
import User from '../models/User';
import { authenticate } from '../middleware/auth';
import { validate, registerSchema } from '../middleware/validation';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if username or email already exists
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user?.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }
    
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user?.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: { username, email } },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Change password
router.put('/me/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
