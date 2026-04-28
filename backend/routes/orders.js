const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Get all orders for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get a single order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Place a new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'Order must contain at least one item' });
    }

    if (!address) {
      return res.status(400).json({ msg: 'Delivery address is required' });
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ msg: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Insufficient stock for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      address,
      paymentMethod: paymentMethod || 'Online',
      status: 'Processing',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      placedAt: new Date()
    });

    await order.save();

    // Award reward points (10 points per order)
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { rewardPoints: 10 }
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ msg: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Mark order as delivered
router.put('/:id/delivered', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Delivered', deliveredAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;