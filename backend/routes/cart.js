const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// In-memory cart storage (use database in production)
const carts = {};

// Get user's cart
router.get('/', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const cart = carts[userId] || [];
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Add item to cart
router.post('/add', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, name, price, quantity } = req.body;

    if (!productId || !name || !price || !quantity) {
      return res.status(400).json({ msg: 'Missing required fields: productId, name, price, quantity' });
    }

    if (!carts[userId]) {
      carts[userId] = [];
    }

    const existingItem = carts[userId].find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      carts[userId].push({ productId, name, price, quantity });
    }

    res.json(carts[userId]);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update item quantity in cart
router.put('/update/:productId', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ msg: 'Invalid quantity' });
    }

    if (!carts[userId]) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const item = carts[userId].find(item => item.productId === productId);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    if (quantity === 0) {
      carts[userId] = carts[userId].filter(item => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    res.json(carts[userId]);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!carts[userId]) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    carts[userId] = carts[userId].filter(item => item.productId !== productId);
    res.json(carts[userId]);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Clear cart
router.delete('/clear', auth, (req, res) => {
  try {
    const userId = req.user.id;
    carts[userId] = [];
    res.json({ msg: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
