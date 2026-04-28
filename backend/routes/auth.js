const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// OTP Login (demo = 1234)
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ msg: "Mobile and OTP are required" });
    }
    if (otp !== "1234") {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
    let user = await User.findOne({ mobile });
    if (!user) {
      user = await User.create({ mobile });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// JWT Middleware for protected routes
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = router;