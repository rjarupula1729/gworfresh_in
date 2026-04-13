const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// OTP Login (demo = 1234)
router.post('/verify-otp', async (req, res) => {
  const { mobile, otp } = req.body;

  if (otp !== "1234") {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  let user = await User.findOne({ mobile });

  if (!user) {
    user = await User.create({ mobile });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.json({ token, user });
});

module.exports = router;