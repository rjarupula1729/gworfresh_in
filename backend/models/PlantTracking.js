const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  date: Date,
  photo: String,
  note: String
});

const plantTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  plantedAt: Date,
  notes: String,
  progress: [progressSchema]
});

module.exports = mongoose.model('PlantTracking', plantTrackingSchema);
