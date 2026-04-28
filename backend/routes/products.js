const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products with optional filtering by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('comboItems');
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Admin: Create a product
router.post('/', async (req, res) => {
  try {
    const { name, description, category, price, stock, images, comboItems, instructions } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ msg: 'Name, price, and category are required' });
    }
    const product = new Product({
      name,
      description,
      category,
      price,
      stock: stock || 0,
      images: images || [],
      comboItems: comboItems || [],
      instructions
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Admin: Update a product
router.put('/:id', async (req, res) => {
  try {
    const { name, description, category, price, stock, images, comboItems, instructions } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, category, price, stock, images, comboItems, instructions },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Admin: Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;