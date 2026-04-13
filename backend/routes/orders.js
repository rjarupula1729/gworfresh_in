const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User'); // ✅ added

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const order = await Order.create({
    userId: req.user.id,
    items: req.body.items,
    totalAmount: req.body.total
  });

  const points = Math.floor(req.body.total / 10);

  await User.findByIdAndUpdate(req.user.id, {
    $inc: { rewardPoints: points }
  });

  res.json({
    order,
    pointsEarned: points
  });
});

module.exports = router;