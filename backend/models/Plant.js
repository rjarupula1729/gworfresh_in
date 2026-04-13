const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  daysPlanted: Number,
  totalDays: Number
});

module.exports = mongoose.model('Plant', plantSchema);