const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: String,
  name: String,
  rewardPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);