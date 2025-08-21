import express from 'express';
import Product from '../models/Product';
import { authenticate } from '../middleware/auth';
import { validate, productSchema } from '../middleware/validation';

const router = express.Router();

// Get all products for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get public products for a user by username
router.get('/public/:username', async (req, res) => {
  try {
    const User = require('../models/User').default;
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const products = await Product.find({ 
      userId: user.id, 
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new product
router.post('/', authenticate, validate(productSchema), async (req, res) => {
  try {
    const { name, description, price, currency, imageUrl, isActive } = req.body;

    const newProduct = new Product({
      userId: req.user.id,
      name,
      description,
      price,
      currency,
      imageUrl,
      isActive
    });

    const product = await newProduct.save();
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a product
router.put('/:id', authenticate, validate(productSchema), async (req, res) => {
  try {
    const { name, description, price, currency, imageUrl, isActive } = req.body;

    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, currency, imageUrl, isActive },
      { new: true }
    );

    res.json({
      success: true,
      data: product
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.remove();

    res.json({
      success: true,
      message: 'Product removed'
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
