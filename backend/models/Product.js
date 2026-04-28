const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  oldPrice: Number,
  category: String,
  emoji: String,
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: "Premium quality product for your garden"
  },
  instructions: {
    type: String,
    default: "• Water regularly\n• Place in sunlight\n• Maintain soil moisture\n• Check for pests weekly"
  },
  stock: {
    type: Number,
    default: 100
  }
});

module.exports = mongoose.model('Product', productSchema);