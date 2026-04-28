// backend/models/Product.js (Complete Updated Version)

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Vegetables', 'Seeds', 'Herbs', 'Fruits', 'Tools', 'Accessories'],
    default: 'Vegetables',
    index: true
  },
  emoji: {
    type: String,
    default: '🌱'
  },

  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // Stock Management
  stock: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  minStockLevel: {
    type: Number,
    default: 10
  },

  // 🌍 REGIONAL INFORMATION
  regions: [{
    type: String,
    enum: ['north', 'south', 'east', 'west', 'central', 'all-regions'],
    index: true
  }],

  // 🌦️ SEASONAL INFORMATION
  seasons: [{
    type: String,
    enum: ['summer', 'monsoon', 'winter', 'year-round'],
    index: true
  }],

  // 💧 GROWING REQUIREMENTS
  growthRequirements: {
    waterNeed: {
      type: String,
      enum: ['low', 'moderate', 'high', 'very-high'],
      default: 'moderate'
    },
    sunlight: {
      type: String,
      enum: ['full', 'partial', 'shade'],
      default: 'full'
    },
    daysToMaturity: {
      type: Number,
      default: 60
    },
    temperature: {
      min: { type: Number, default: 10 },
      max: { type: Number, default: 30 }
    },
    humidity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate'
    },
    soilType: {
      type: String,
      enum: ['loamy', 'clay', 'sandy', 'mixed'],
      default: 'loamy'
    },
    pH: {
      min: { type: Number, default: 6.0 },
      max: { type: Number, default: 7.5 }
    }
  },

  // 🥼 CARE INSTRUCTIONS
  careInstructions: {
    watering: String,
    sunlight: String,
    soil: String,
    fertilizer: String,
    pestControl: String,
    harvesting: String,
    spacing: String,
    specialCare: String
  },

  // 📊 SUITABILITY SCORES BY REGION
  suitabilityScores: [{
    region: {
      type: String,
      enum: ['north', 'south', 'east', 'west', 'central']
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    reason: String,
    _id: false
  }],

  // 📈 DIFFICULTY LEVELS
  difficulty: {
    type: String,
    enum: ['very-easy', 'easy', 'medium', 'hard'],
    default: 'medium',
    index: true
  },

  // 🌱 YIELD INFORMATION
  yield: {
    type: String,
    enum: ['low', 'medium', 'high', 'very-high'],
    default: 'medium'
  },
  yieldPerPlant: {
    value: Number,
    unit: String // kg, units, bundles, etc.
  },

  // 📸 IMAGES & MEDIA
  images: [{
    type: String,
    default: []
  }],
  thumbnail: String,

  // 🔖 TAGS & METADATA
  tags: [{
    type: String,
    lowercase: true
  }],
  popularityScore: {
    type: Number,
    default: 0,
    index: true
  },

  // 👨‍🌾 FARMING TIPS
  tips: [{
    title: String,
    description: String,
    imageUrl: String
  }],

  // 📋 COMPANION PLANTING
  companionPlants: [{
    type: String
  }],
  avoidWith: [{
    type: String
  }],

  // 🌾 FERTILIZER RECOMMENDATIONS
  fertilizer: {
    type: {
      type: String,
      enum: ['Organic', 'Inorganic', 'Mixed'],
      default: 'Organic'
    },
    composition: String, // e.g., "NPK 10-10-10"
    frequency: String, // e.g., "Every 2 weeks"
    amount: String // e.g., "100g per plant"
  },

  // 🐛 PEST & DISEASE MANAGEMENT
  commonPests: [{
    name: String,
    symptoms: String,
    treatment: String
  }],
  commonDiseases: [{
    name: String,
    symptoms: String,
    treatment: String
  }],

  // 🌱 SEED & GROWING INFO
  seedInfo: {
    germination: {
      daysToSprout: Number,
      temperature: { min: Number, max: Number },
      moisture: String
    },
    seedsPerPacket: Number,
    seedSpacing: String,
    rowSpacing: String
  },

  // 📊 RATING & REVIEWS
  rating: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 }
  },

  // 🔗 RELATED PRODUCTS
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  // 📅 TIMESTAMPS & METADATA
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for is in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Virtual for discount price
productSchema.virtual('discountedPrice').get(function() {
  if (this.oldPrice && this.discount > 0) {
    return this.oldPrice - (this.oldPrice * this.discount / 100);
  }
  return this.price;
});

// Virtual for is low stock
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.minStockLevel;
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ regions: 1, seasons: 1 });
productSchema.index({ 'suitabilityScores.region': 1, 'suitabilityScores.score': -1 });
productSchema.index({ difficulty: 1, popularity: -1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get products by region and season
productSchema.statics.getByRegionAndSeason = function(regionId, season) {
  return this.find({
    regions: { $in: [regionId, 'all-regions'] },
    seasons: { $in: [season, 'year-round'] },
    isActive: true
  }).sort({ 'suitabilityScores.score': -1 });
};

// Static method to get all products for a region
productSchema.statics.getByRegion = function(regionId) {
  return this.find({
    regions: { $in: [regionId, 'all-regions'] },
    isActive: true
  }).sort({ 'suitabilityScores.score': -1 });
};

// Static method to search products
productSchema.statics.searchProducts = function(query, regionId = null) {
  let searchQuery = { isActive: true };

  if (regionId) {
    searchQuery.regions = { $in: [regionId, 'all-regions'] };
  }

  return this.find({
    ...searchQuery,
    $text: { $search: query }
  });
};

// Static method to get featured products for a region
productSchema.statics.getFeaturedByRegion = function(regionId) {
  return this.find({
    regions: { $in: [regionId, 'all-regions'] },
    isFeatured: true,
    isActive: true
  }).limit(10);
};

// Static method to get easy-to-grow products
productSchema.statics.getEasyGrow = function(regionId = null) {
  let query = { 
    difficulty: { $in: ['very-easy', 'easy'] },
    isActive: true
  };

  if (regionId) {
    query.regions = { $in: [regionId, 'all-regions'] };
  }

  return this.find(query);
};

// Instance method to get suitability for a region
productSchema.methods.getSuitabilityForRegion = function(regionId) {
  const score = this.suitabilityScores.find(s => s.region === regionId);
  return score || { score: 50, reason: 'Suitable', region: regionId };
};

// Instance method to check if available in region
productSchema.methods.isAvailableInRegion = function(regionId) {
  return this.regions.includes(regionId) || this.regions.includes('all-regions');
};

// Instance method to check if available in season
productSchema.methods.isAvailableInSeason = function(season) {
  return this.seasons.includes(season) || this.seasons.includes('year-round');
};

// Create and export model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Get summer vegetables for North India
const northSummer = await Product.getByRegionAndSeason('north', 'summer');

// Get all products for South India
const southProducts = await Product.getByRegion('south');

// Search for "tomato" in West region
const westTomatoes = await Product.searchProducts('tomato', 'west');

// Get featured products for East region
const eastFeatured = await Product.getFeaturedByRegion('east');

// Get easy-to-grow vegetables
const easyVegetables = await Product.getEasyGrow('central');

// Get suitability for a specific product
const product = await Product.findById(productId);
const suitability = product.getSuitabilityForRegion('south');

// Check if available
const available = product.isAvailableInRegion('north') && product.isAvailableInSeason('winter');

// Create new product with all data
const newProduct = new Product({
  name: 'Spinach',
  emoji: '🥬',
  price: 99,
  stock: 100,
  regions: ['north', 'east', 'central'],
  seasons: ['winter', 'monsoon'],
  difficulty: 'easy',
  yield: 'high',
  growthRequirements: {
    waterNeed: 'moderate',
    sunlight: 'partial',
    daysToMaturity: 45,
    temperature: { min: 10, max: 20 },
    soilType: 'loamy'
  },
  suitabilityScores: [
    { region: 'north', score: 90, reason: 'Perfect for winter' },
    { region: 'east', score: 88, reason: 'Great monsoon crop' },
    { region: 'central', score: 85, reason: 'Very suitable' }
  ],
  careInstructions: {
    watering: 'Water moderately...',
    sunlight: 'Can tolerate partial shade...',
    soil: 'Rich loamy soil...',
    fertilizer: 'Nitrogen-rich fertilizer every 2-3 weeks',
    harvesting: 'Pick outer leaves when 2-3 inches long'
  }
});

await newProduct.save();
*/
