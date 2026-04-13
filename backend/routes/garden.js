const express = require('express');
const auth = require('../middleware/auth');
const Plant = require('../models/Plant');
const User = require('../models/User'); // ✅ added

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const plants = await Plant.find({ userId: req.user.id });
  res.json(plants);
});

router.post('/', auth, async (req, res) => {
  const plant = await Plant.create({
    userId: req.user.id,
    ...req.body
  });

  // 🎁 Reward logic
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { rewardPoints: 10 }
  });

  res.json(plant);
});

module.exports = router;