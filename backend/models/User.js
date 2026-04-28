const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, unique: true, required: true },
  name: String,
  rewardPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);