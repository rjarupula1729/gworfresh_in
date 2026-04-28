const express = require('express');
const auth = require('../middleware/auth');
const PlantTracking = require('../models/PlantTracking');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Get all plants for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const plants = await PlantTracking.find({ userId: req.user.id }).populate('productId');
    res.json(plants);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get a single plant by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const plant = await PlantTracking.findById(req.params.id).populate('productId');
    if (!plant) {
      return res.status(404).json({ msg: 'Plant tracking not found' });
    }
    if (plant.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    res.json(plant);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Add a new plant to track
router.post('/', auth, async (req, res) => {
  try {
    const { productId, plantedAt, notes } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const plant = new PlantTracking({
      userId: req.user.id,
      productId,
      plantedAt: plantedAt || new Date(),
      notes,
      progress: []
    });

    await plant.save();

    // Award reward points for starting a plant
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { rewardPoints: 5 }
    });

    res.json(plant);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Add progress update to a plant
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { date, photo, note } = req.body;

    if (!note) {
      return res.status(400).json({ msg: 'Note is required' });
    }

    const plant = await PlantTracking.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ msg: 'Plant tracking not found' });
    }

    if (plant.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    plant.progress.push({
      date: date || new Date(),
      photo,
      note
    });

    await plant.save();

    // Award reward points for logging progress
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { rewardPoints: 2 }
    });

    res.json(plant);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get care instructions for a product
router.get('/instructions/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({
      productName: product.name,
      instructions: product.instructions || 'No care instructions available'
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete a plant tracking record
router.delete('/:id', auth, async (req, res) => {
  try {
    const plant = await PlantTracking.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ msg: 'Plant tracking not found' });
    }

    if (plant.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await PlantTracking.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Plant tracking deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;