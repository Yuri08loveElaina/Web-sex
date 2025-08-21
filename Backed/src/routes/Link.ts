import express from 'express';
import Link from '../models/Link';
import { authenticate } from '../middleware/auth';
import { validate, linkSchema } from '../middleware/validation';

const router = express.Router();

// Get all links for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.id }).sort({ order: 1 });
    res.json({
      success: true,
      count: links.length,
      data: links
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get public links for a user by username
router.get('/public/:username', async (req, res) => {
  try {
    const User = require('../models/User').default;
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const links = await Link.find({ 
      userId: user.id, 
      isActive: true 
    }).sort({ order: 1 });

    res.json({
      success: true,
      count: links.length,
      data: links
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new link
router.post('/', authenticate, validate(linkSchema), async (req, res) => {
  try {
    const { title, url, icon, isActive, order } = req.body;

    const newLink = new Link({
      userId: req.user.id,
      title,
      url,
      icon,
      isActive,
      order
    });

    const link = await newLink.save();
    res.status(201).json({
      success: true,
      data: link
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a link
router.put('/:id', authenticate, validate(linkSchema), async (req, res) => {
  try {
    const { title, url, icon, isActive, order } = req.body;

    let link = await Link.findById(req.params.id);
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Check if user owns the link
    if (link.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    link = await Link.findByIdAndUpdate(
      req.params.id,
      { title, url, icon, isActive, order },
      { new: true }
    );

    res.json({
      success: true,
      data: link
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a link
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Check if user owns the link
    if (link.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await link.remove();

    res.json({
      success: true,
      message: 'Link removed'
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Reorder links
router.put('/reorder', authenticate, async (req, res) => {
  try {
    const { links } = req.body;
    
    if (!Array.isArray(links)) {
      return res.status(400).json({ message: 'Invalid links data' });
    }

    // Update each link's order
    const updatePromises = links.map((link: any) => {
      return Link.findByIdAndUpdate(
        link.id,
        { order: link.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Links reordered successfully'
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
