const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  oldPrice: Number,
  category: String,
  emoji: String
});

module.exports = mongoose.model('Product', productSchema);