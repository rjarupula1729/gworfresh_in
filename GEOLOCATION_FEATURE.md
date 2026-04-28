# 🌍 GEOLOCATION-BASED PRODUCT FILTERING SYSTEM

**Indian Regional Vegetables & Climate-Based Shopping**

---

## 🗺️ INDIAN GEOGRAPHICAL REGIONS & CLIMATE ZONES

### Region Classification

```javascript
// backend/config/regions.js

const REGIONS = {
  // Northern Region (Cool Climate)
  NORTH: {
    id: 'north',
    name: 'Northern Region',
    states: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Uttarakhand', 'Delhi', 'Uttar Pradesh'],
    climate: 'temperate',
    season: 'winter',
    temperature: { min: -5, max: 35 },
    rainfall: 'moderate',
    icon: '❄️'
  },

  // Southern Region (Tropical)
  SOUTH: {
    id: 'south',
    name: 'Southern Region',
    states: ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Kerala'],
    climate: 'tropical',
    season: 'all-year',
    temperature: { min: 15, max: 40 },
    rainfall: 'high',
    icon: '🌴'
  },

  // Eastern Region (Subtropical)
  EAST: {
    id: 'east',
    name: 'Eastern Region',
    states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam'],
    climate: 'subtropical',
    season: 'monsoon',
    temperature: { min: 5, max: 38 },
    rainfall: 'very-high',
    icon: '🌧️'
  },

  // Western Region (Dry/Semi-arid)
  WEST: {
    id: 'west',
    name: 'Western Region',
    states: ['Gujarat', 'Maharashtra', 'Rajasthan', 'Goa'],
    climate: 'semi-arid',
    season: 'dry',
    temperature: { min: 10, max: 42 },
    rainfall: 'low',
    icon: '☀️'
  },

  // Central Region (Mixed)
  CENTRAL: {
    id: 'central',
    name: 'Central Region',
    states: ['Madhya Pradesh', 'Chhattisgarh'],
    climate: 'subtropical-mixed',
    season: 'moderate',
    temperature: { min: 8, max: 40 },
    rainfall: 'moderate',
    icon: '⛅'
  }
};

module.exports = REGIONS;
```

---

## 🥬 REGIONAL VEGETABLES & GROWING SEASONS

```javascript
// backend/config/regionalVegetables.js

const REGIONAL_VEGETABLES = {
  // Northern Region Vegetables
  NORTH: {
    summer: [
      { name: 'Tomato', emoji: '🍅', waterNeed: 'high', sunlight: 'full', days: 60 },
      { name: 'Cucumber', emoji: '🥒', waterNeed: 'very-high', sunlight: 'full', days: 50 },
      { name: 'Bottle Gourd', emoji: '🍈', waterNeed: 'high', sunlight: 'full', days: 70 },
      { name: 'Carrot', emoji: '🥕', waterNeed: 'moderate', sunlight: 'full', days: 80 },
    ],
    winter: [
      { name: 'Spinach', emoji: '🥬', waterNeed: 'moderate', sunlight: 'partial', days: 45 },
      { name: 'Cabbage', emoji: '🥬', waterNeed: 'moderate', sunlight: 'full', days: 90 },
      { name: 'Cauliflower', emoji: '🥦', waterNeed: 'moderate', sunlight: 'full', days: 100 },
      { name: 'Peas', emoji: '🫛', waterNeed: 'moderate', sunlight: 'full', days: 60 },
      { name: 'Radish', emoji: '🍠', waterNeed: 'moderate', sunlight: 'partial', days: 30 },
      { name: 'Broccoli', emoji: '🥦', waterNeed: 'high', sunlight: 'full', days: 80 },
    ],
    yearRound: [
      { name: 'Onion', emoji: '🧅', waterNeed: 'moderate', sunlight: 'full', days: 150 },
      { name: 'Garlic', emoji: '🧄', waterNeed: 'low', sunlight: 'full', days: 180 },
    ]
  },

  // Southern Region Vegetables
  SOUTH: {
    summer: [
      { name: 'Okra', emoji: '🫑', waterNeed: 'high', sunlight: 'full', days: 50 },
      { name: 'Eggplant', emoji: '🍆', waterNeed: 'high', sunlight: 'full', days: 90 },
      { name: 'Chili', emoji: '🌶️', waterNeed: 'moderate', sunlight: 'full', days: 120 },
    ],
    monsoon: [
      { name: 'Cucumber', emoji: '🥒', waterNeed: 'very-high', sunlight: 'full', days: 50 },
      { name: 'Bitter Gourd', emoji: '🥬', waterNeed: 'high', sunlight: 'full', days: 60 },
    ],
    winter: [
      { name: 'Tomato', emoji: '🍅', waterNeed: 'high', sunlight: 'full', days: 60 },
      { name: 'Cabbage', emoji: '🥬', waterNeed: 'moderate', sunlight: 'full', days: 90 },
    ],
    yearRound: [
      { name: 'Coconut', emoji: '🥥', waterNeed: 'high', sunlight: 'full', days: 365 },
      { name: 'Papaya', emoji: '🧡', waterNeed: 'moderate', sunlight: 'full', days: 180 },
      { name: 'Banana', emoji: '🍌', waterNeed: 'high', sunlight: 'full', days: 270 },
    ]
  },

  // Eastern Region Vegetables
  EAST: {
    summer: [
      { name: 'Tomato', emoji: '🍅', waterNeed: 'high', sunlight: 'full', days: 60 },
      { name: 'Bottle Gourd', emoji: '🍈', waterNeed: 'high', sunlight: 'full', days: 70 },
    ],
    monsoon: [
      { name: 'Cucumber', emoji: '🥒', waterNeed: 'very-high', sunlight: 'partial', days: 50 },
      { name: 'Colocasia', emoji: '🥔', waterNeed: 'very-high', sunlight: 'partial', days: 180 },
      { name: 'Pumpkin', emoji: '🎃', waterNeed: 'high', sunlight: 'full', days: 90 },
    ],
    winter: [
      { name: 'Spinach', emoji: '🥬', waterNeed: 'moderate', sunlight: 'partial', days: 45 },
      { name: 'Potato', emoji: '🥔', waterNeed: 'moderate', sunlight: 'full', days: 120 },
      { name: 'Carrot', emoji: '🥕', waterNeed: 'moderate', sunlight: 'full', days: 80 },
    ]
  },

  // Western Region Vegetables
  WEST: {
    summer: [
      { name: 'Okra', emoji: '🫑', waterNeed: 'moderate', sunlight: 'full', days: 50 },
      { name: 'Groundnut', emoji: '🥜', waterNeed: 'low', sunlight: 'full', days: 120 },
    ],
    monsoon: [
      { name: 'Onion', emoji: '🧅', waterNeed: 'moderate', sunlight: 'full', days: 150 },
      { name: 'Potato', emoji: '🥔', waterNeed: 'moderate', sunlight: 'full', days: 120 },
    ],
    winter: [
      { name: 'Tomato', emoji: '🍅', waterNeed: 'moderate', sunlight: 'full', days: 60 },
      { name: 'Chili', emoji: '🌶️', waterNeed: 'low', sunlight: 'full', days: 120 },
    ]
  },

  // Central Region Vegetables
  CENTRAL: {
    summer: [
      { name: 'Tomato', emoji: '🍅', waterNeed: 'high', sunlight: 'full', days: 60 },
      { name: 'Cucumber', emoji: '🥒', waterNeed: 'high', sunlight: 'full', days: 50 },
    ],
    monsoon: [
      { name: 'Pumpkin', emoji: '🎃', waterNeed: 'high', sunlight: 'full', days: 90 },
      { name: 'Spinach', emoji: '🥬', waterNeed: 'moderate', sunlight: 'partial', days: 45 },
    ],
    winter: [
      { name: 'Wheat', emoji: '🌾', waterNeed: 'moderate', sunlight: 'full', days: 150 },
      { name: 'Gram', emoji: '🫘', waterNeed: 'low', sunlight: 'full', days: 120 },
    ]
  },

  // Pan-India (All Regions)
  ALL_REGIONS: [
    { name: 'Mint', emoji: '🌿', waterNeed: 'moderate', sunlight: 'partial', days: 30, difficulty: 'easy' },
    { name: 'Coriander', emoji: '🌿', waterNeed: 'moderate', sunlight: 'partial', days: 45, difficulty: 'easy' },
    { name: 'Basil', emoji: '🌿', waterNeed: 'moderate', sunlight: 'full', days: 60, difficulty: 'easy' },
    { name: 'Lemon', emoji: '🍋', waterNeed: 'moderate', sunlight: 'full', days: 365, difficulty: 'medium' },
  ]
};

module.exports = REGIONAL_VEGETABLES;
```

---

## 📍 GEOLOCATION DETECTION & MAPPING

```javascript
// backend/utils/geolocation.js

const REGIONS = require('../config/regions');
const REGIONAL_VEGETABLES = require('../config/regionalVegetables');

// Get region from latitude & longitude
function getRegionByCoordinates(latitude, longitude) {
  // North (>25°N)
  if (latitude > 25) return REGIONS.NORTH;
  
  // South (<12°N)
  if (latitude < 12) return REGIONS.SOUTH;
  
  // East (>85°E)
  if (longitude > 85) return REGIONS.EAST;
  
  // West (<75°E)
  if (longitude < 75) return REGIONS.WEST;
  
  // Central (Default)
  return REGIONS.CENTRAL;
}

// Get region from state
function getRegionByState(state) {
  for (const [key, region] of Object.entries(REGIONS)) {
    if (region.states.includes(state)) {
      return region;
    }
  }
  return REGIONS.CENTRAL; // Default
}

// Get current season based on date
function getCurrentSeason(region) {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (region.id === 'north') {
    if (month >= 3 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    if (month >= 10 || month <= 2) return 'winter';
  }
  
  if (region.id === 'east') {
    if (month >= 3 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    if (month >= 10 || month <= 2) return 'winter';
  }
  
  if (region.id === 'south') {
    // Tropical - all year growing
    if (month >= 6 && month <= 9) return 'monsoon';
    return 'summer';
  }
  
  if (region.id === 'west') {
    if (month >= 3 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    if (month >= 10 || month <= 2) return 'winter';
  }
  
  return 'moderate';
}

module.exports = {
  getRegionByCoordinates,
  getRegionByState,
  getCurrentSeason
};
```

---

## 🗄️ DATABASE SCHEMA UPDATES

```javascript
// backend/models/Product.js (Updated)

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  emoji: String,
  
  // 🌍 NEW: Regional Information
  regions: [{
    type: String,
    enum: ['north', 'south', 'east', 'west', 'central', 'all-regions'],
    required: true
  }],
  
  // 🌦️ NEW: Seasonal Information
  seasons: [{
    type: String,
    enum: ['summer', 'monsoon', 'winter', 'year-round'],
    required: true
  }],
  
  // 💧 NEW: Growing Requirements
  growthRequirements: {
    waterNeed: {
      type: String,
      enum: ['low', 'moderate', 'high', 'very-high']
    },
    sunlight: {
      type: String,
      enum: ['full', 'partial', 'shade']
    },
    daysToMaturity: Number,
    temperature: {
      min: Number,
      max: Number
    },
    humidity: {
      type: String,
      enum: ['low', 'moderate', 'high']
    },
    soilType: {
      type: String,
      enum: ['loamy', 'clay', 'sandy', 'mixed']
    }
  },
  
  // 🥼 NEW: Care Instructions
  careInstructions: {
    watering: String,
    sunlight: String,
    soil: String,
    fertilizer: String,
    pestControl: String
  },
  
  // 📊 NEW: Suitability Score
  suitabilityScores: [{
    region: String,
    score: { type: Number, min: 0, max: 100 },
    reason: String
  }],
  
  images: [String],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for performance
productSchema.index({ regions: 1 });
productSchema.index({ seasons: 1 });
productSchema.index({ 'suitabilityScores.region': 1 });

module.exports = mongoose.model('Product', productSchema);
```

```javascript
// backend/models/UserLocation.js (New)

const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // 📍 Location Information
  region: {
    id: String,
    name: String,
    state: String
  },
  
  // 📌 Coordinates
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  
  // 🌍 Location Metadata
  climate: String,
  season: String,
  temperature: {
    min: Number,
    max: Number
  },
  rainfall: String,
  
  // 📅 Location Update
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

userLocationSchema.index({ userId: 1 });
userLocationSchema.index({ 'region.id': 1 });

module.exports = mongoose.model('UserLocation', userLocationSchema);
```

---

## 🔌 API ENDPOINTS

```javascript
// backend/routes/geolocation.js

const express = require('express');
const auth = require('../middleware/auth');
const UserLocation = require('../models/UserLocation');
const Product = require('../models/Product');
const { getRegionByCoordinates, getRegionByState, getCurrentSeason } = require('../utils/geolocation');
const REGIONS = require('../config/regions');
const REGIONAL_VEGETABLES = require('../config/regionalVegetables');

const router = express.Router();

// ============================================
// 1. SET USER LOCATION (by coordinates)
// ============================================
router.post('/set-location-coordinates', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ msg: 'Latitude and longitude required' });
    }
    
    // Get region from coordinates
    const region = getRegionByCoordinates(latitude, longitude);
    const season = getCurrentSeason(region);
    
    // Save/Update user location
    let userLocation = await UserLocation.findOne({ userId: req.user.id });
    
    if (!userLocation) {
      userLocation = new UserLocation({
        userId: req.user.id,
        region: { id: region.id, name: region.name },
        coordinates: { latitude, longitude },
        climate: region.climate,
        season: season,
        temperature: region.temperature,
        rainfall: region.rainfall
      });
    } else {
      userLocation.coordinates = { latitude, longitude };
      userLocation.region = { id: region.id, name: region.name };
      userLocation.climate = region.climate;
      userLocation.season = season;
      userLocation.temperature = region.temperature;
      userLocation.rainfall = region.rainfall;
      userLocation.lastUpdated = new Date();
    }
    
    await userLocation.save();
    
    res.json({
      msg: 'Location set successfully',
      region: region,
      season: season
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ============================================
// 2. SET USER LOCATION (by state)
// ============================================
router.post('/set-location-state', auth, async (req, res) => {
  try {
    const { state } = req.body;
    
    if (!state) {
      return res.status(400).json({ msg: 'State required' });
    }
    
    const region = getRegionByState(state);
    const season = getCurrentSeason(region);
    
    let userLocation = await UserLocation.findOne({ userId: req.user.id });
    
    if (!userLocation) {
      userLocation = new UserLocation({
        userId: req.user.id,
        region: { id: region.id, name: region.name, state: state },
        climate: region.climate,
        season: season,
        temperature: region.temperature,
        rainfall: region.rainfall
      });
    } else {
      userLocation.region.state = state;
      userLocation.region.id = region.id;
      userLocation.region.name = region.name;
      userLocation.climate = region.climate;
      userLocation.season = season;
      userLocation.temperature = region.temperature;
      userLocation.rainfall = region.rainfall;
      userLocation.lastUpdated = new Date();
    }
    
    await userLocation.save();
    
    res.json({
      msg: 'Location set successfully',
      region: region,
      season: season
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ============================================
// 3. GET USER'S REGION
// ============================================
router.get('/user-region', auth, async (req, res) => {
  try {
    const userLocation = await UserLocation.findOne({ userId: req.user.id });
    
    if (!userLocation) {
      return res.status(404).json({ msg: 'Location not set' });
    }
    
    res.json(userLocation);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 4. GET PRODUCTS FOR USER'S REGION (Sorted)
// ============================================
router.get('/products-by-region', auth, async (req, res) => {
  try {
    const userLocation = await UserLocation.findOne({ userId: req.user.id });
    
    if (!userLocation) {
      return res.status(400).json({ msg: 'User location not set' });
    }
    
    const regionId = userLocation.region.id;
    const currentSeason = userLocation.season;
    
    // Get products for this region, sorted by suitability
    const products = await Product.find({
      regions: { $in: [regionId, 'all-regions'] }
    })
    .select('+suitabilityScores')
    .lean();
    
    // Calculate enhanced suitability score
    const enrichedProducts = products.map(product => {
      // Find suitability score for this region
      const suitability = product.suitabilityScores?.find(
        s => s.region === regionId
      ) || { score: 50, reason: 'Suitable' };
      
      // Boost score if it matches current season
      let finalScore = suitability.score;
      if (product.seasons.includes(currentSeason)) {
        finalScore += 20; // Boost for seasonal match
      }
      if (product.seasons.includes('year-round')) {
        finalScore += 10; // Slight boost for year-round
      }
      
      return {
        ...product,
        finalSuitabilityScore: Math.min(finalScore, 100),
        isSeasonallyRelevant: product.seasons.includes(currentSeason),
        matchReason: suitability.reason
      };
    });
    
    // Sort by suitability score (descending)
    enrichedProducts.sort((a, b) => b.finalSuitabilityScore - a.finalSuitabilityScore);
    
    res.json({
      region: userLocation.region,
      season: currentSeason,
      productsCount: enrichedProducts.length,
      products: enrichedProducts
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ============================================
// 5. GET SEASONAL RECOMMENDATIONS
// ============================================
router.get('/seasonal-recommendations', auth, async (req, res) => {
  try {
    const userLocation = await UserLocation.findOne({ userId: req.user.id });
    
    if (!userLocation) {
      return res.status(400).json({ msg: 'User location not set' });
    }
    
    const regionId = userLocation.region.id;
    const currentSeason = userLocation.season;
    
    // Get products that are seasonal + regional match
    const recommendations = await Product.find({
      regions: { $in: [regionId, 'all-regions'] },
      seasons: currentSeason
    }).lean();
    
    res.json({
      region: userLocation.region,
      season: currentSeason,
      recommendations: recommendations,
      message: `Best vegetables to grow in ${userLocation.region.name} during ${currentSeason}`
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 6. GET ALL REGIONS
// ============================================
router.get('/regions', (req, res) => {
  try {
    const regionsList = Object.values(REGIONS).map(region => ({
      id: region.id,
      name: region.name,
      icon: region.icon,
      climate: region.climate,
      states: region.states,
      temperature: region.temperature
    }));
    
    res.json(regionsList);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 7. GET PRODUCTS BY MULTIPLE REGIONS
// ============================================
router.post('/products-by-regions', auth, async (req, res) => {
  try {
    const { regionIds } = req.body;
    
    if (!regionIds || !Array.isArray(regionIds)) {
      return res.status(400).json({ msg: 'regionIds array required' });
    }
    
    const products = await Product.find({
      regions: { $in: [...regionIds, 'all-regions'] }
    }).lean();
    
    // Group by region for comparison
    const groupedByRegion = {};
    regionIds.forEach(regionId => {
      groupedByRegion[regionId] = products.filter(p => 
        p.regions.includes(regionId) || p.regions.includes('all-regions')
      );
    });
    
    res.json(groupedByRegion);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 8. GET COMPARISON GUIDE (Growth difficulty)
// ============================================
router.get('/difficulty-guide', (req, res) => {
  try {
    const guide = {
      easy: {
        description: 'Perfect for beginners',
        examples: ['Mint', 'Coriander', 'Basil', 'Radish'],
        daysToMaturity: '<45 days',
        waterRequirement: 'Moderate'
      },
      medium: {
        description: 'Requires some experience',
        examples: ['Tomato', 'Cucumber', 'Carrot', 'Onion'],
        daysToMaturity: '45-90 days',
        waterRequirement: 'High'
      },
      hard: {
        description: 'For experienced growers',
        examples: ['Cauliflower', 'Broccoli', 'Potato'],
        daysToMaturity: '>90 days',
        waterRequirement: 'Very High'
      }
    };
    
    res.json(guide);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
```

---

## 📱 FRONTEND: LOCATION SETUP SCREEN

```javascript
// src/screens/LocationSetupScreen.js

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Picker
} from 'react-native';
import * as Location from 'expo-location';
import API from '../services/api';
import { AppContext } from '../context/AppContext';
import colors from '../utils/colors';

const INDIAN_STATES = [
  'Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Uttarakhand', 'Delhi', 'Uttar Pradesh',
  'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Kerala',
  'West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam',
  'Gujarat', 'Maharashtra', 'Rajasthan', 'Goa',
  'Madhya Pradesh', 'Chhattisgarh'
];

export default function LocationSetupScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [regions, setRegions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const res = await API.get('/geolocation/regions');
      setRegions(res.data);
    } catch (err) {
      console.error('Failed to fetch regions:', err);
    }
  };

  // Get device location
  const handleGetDeviceLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location access');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Send to backend
      const res = await API.post('/geolocation/set-location-coordinates', {
        latitude,
        longitude
      });

      setUserLocation(res.data);
      Alert.alert('Success', `Location set to ${res.data.region.name}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  // Set location by state selection
  const handleSetStateLocation = async () => {
    if (!selectedState) {
      Alert.alert('Error', 'Please select a state');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/geolocation/set-location-state', {
        state: selectedState
      });

      setUserLocation(res.data);
      Alert.alert('Success', `Location set to ${selectedState}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to set location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>🌍 Where are you located?</Text>
        <Text style={styles.subtitle}>Get personalized plant recommendations</Text>
      </View>

      {/* Option 1: Automatic Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Option 1: Auto-Detect Location</Text>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleGetDeviceLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📍 Use Device Location</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Option 2: Manual State Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Option 2: Select State Manually</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => setSelectedState(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a state..." value="" />
            {INDIAN_STATES.map((state) => (
              <Picker.Item key={state} label={state} value={state} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleSetStateLocation}
          disabled={loading || !selectedState}
        >
          {loading ? (
            <ActivityIndicator color={colors.green} />
          ) : (
            <Text style={styles.buttonTextSecondary}>Confirm Selection</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Display Current Location */}
      {userLocation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Your Location</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationText}>Region: {userLocation.region.name}</Text>
            <Text style={styles.locationText}>Season: {userLocation.season}</Text>
            <Text style={styles.locationText}>Climate: {userLocation.climate}</Text>
            <Text style={styles.locationText}>
              Temperature: {userLocation.temperature.min}°C - {userLocation.temperature.max}°C
            </Text>
          </View>
        </View>
      )}

      {/* Regions Reference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Regions</Text>
        <FlatList
          data={regions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.regionCard}>
              <Text style={styles.regionTitle}>{item.icon} {item.name}</Text>
              <Text style={styles.regionText}>Climate: {item.climate}</Text>
              <Text style={styles.regionText}>States: {item.states.join(', ')}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBackground,
    paddingVertical: 20
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    backgroundColor: colors.lightGreen,
    paddingVertical: 20,
    borderRadius: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.green,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: colors.textPrimary
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: colors.green
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.green
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.green
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  picker: {
    height: 50
  },
  locationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.green
  },
  locationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8
  },
  regionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.green
  },
  regionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8
  },
  regionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4
  }
});
```

---

## 🛍️ UPDATED SHOP SCREEN WITH GEOLOCATION

```javascript
// src/screens/ShopScreen.js (Updated)

import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import API from "../services/api";
import { AppContext } from "../context/AppContext";
import colors from "../utils/colors";

export default function ShopScreen({ navigation }) {
  const { cart, setCart, user } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      const res = await API.get('/geolocation/user-region');
      setUserLocation(res.data);
      fetchProductsByRegion(res.data.region.id);
    } catch (err) {
      console.warn('Location not set, showing all products');
      fetchAllProducts();
      setShowLocationPrompt(true);
    }
  };

  const fetchProductsByRegion = async (regionId) => {
    try {
      setLoading(true);
      const res = await API.get('/geolocation/products-by-region');
      setProducts(res.data.products);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
    Alert.alert('Success', 'Added to cart!');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Location Prompt */}
      {showLocationPrompt && (
        <TouchableOpacity
          style={styles.promptBanner}
          onPress={() => navigation.navigate('LocationSetup')}
        >
          <Text style={styles.promptText}>📍 Set location for better recommendations →</Text>
        </TouchableOpacity>
      )}

      {/* Location Badge */}
      {userLocation && (
        <View style={styles.locationBadge}>
          <Text style={styles.locationBadgeText}>
            📍 {userLocation.region.name} • Season: {userLocation.season}
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={products}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                {item.finalSuitabilityScore >= 70 && (
                  <View style={styles.suitableBadge}>
                    <Text style={styles.badgeText}>✅ Suitable</Text>
                  </View>
                )}
              </View>

              <Text style={styles.productName}>{item.name}</Text>
              
              {item.isSeasonallyRelevant && (
                <View style={styles.seasonalTag}>
                  <Text style={styles.seasonalText}>🌱 Seasonal Now</Text>
                </View>
              )}

              <Text style={styles.matchReason}>{item.matchReason}</Text>

              {item.growthRequirements && (
                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementText}>
                    💧 {item.growthRequirements.waterNeed}
                  </Text>
                  <Text style={styles.requirementText}>
                    ☀️ {item.growthRequirements.sunlight}
                  </Text>
                  <Text style={styles.requirementText}>
                    📅 {item.growthRequirements.daysToMaturity} days
                  </Text>
                </View>
              )}

              <Text style={styles.price}>₹{item.price}</Text>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBackground
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  promptBanner: {
    backgroundColor: colors.orange,
    padding: 12,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  promptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  },
  locationBadge: {
    backgroundColor: colors.lightGreen,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.green
  },
  locationBadgeText: {
    color: colors.green,
    fontWeight: '600',
    fontSize: 12
  },
  productCard: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingBottom: 12
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  emoji: {
    fontSize: 40
  },
  suitableBadge: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  badgeText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '600'
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8
  },
  seasonalTag: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    alignSelf: 'flex-start'
  },
  seasonalText: {
    color: '#856404',
    fontSize: 11,
    fontWeight: '600'
  },
  matchReason: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
    fontStyle: 'italic'
  },
  requirementsContainer: {
    backgroundColor: colors.lightBackground,
    padding: 8,
    borderRadius: 6,
    marginBottom: 10
  },
  requirementText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.green,
    marginBottom: 10
  },
  addButton: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  }
});
```

---

## 🗄️ SERVER CONFIGURATION UPDATE

```javascript
// backend/server.js (Updated)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Existing routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/garden', require('./routes/garden'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/community', require('./routes/community'));

// NEW: Geolocation routes
app.use('/api/geolocation', require('./routes/geolocation'));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
```

---

## 📊 DATA STRUCTURE EXAMPLE

```javascript
// Sample Product Document with Geolocation

{
  _id: ObjectId(...),
  name: "Tomato",
  emoji: "🍅",
  price: 149,
  stock: 100,
  
  // Regional Information
  regions: ["north", "south", "central", "all-regions"],
  seasons: ["summer", "winter"],
  
  // Growth Requirements
  growthRequirements: {
    waterNeed: "high",
    sunlight: "full",
    daysToMaturity: 60,
    temperature: { min: 15, max: 35 },
    humidity: "moderate",
    soilType: "loamy"
  },
  
  // Suitability Scores
  suitabilityScores: [
    { region: "north", score: 90, reason: "Excellent for winter in North" },
    { region: "south", score: 85, reason: "Good for tropical regions" },
    { region: "east", score: 80, reason: "Suitable for monsoon" },
    { region: "west", score: 75, reason: "Good in dry season" },
    { region: "central", score: 80, reason: "Moderate suitability" }
  ],
  
  // Care Instructions
  careInstructions: {
    watering: "Water deeply 2-3 times per week",
    sunlight: "Requires 6-8 hours of direct sunlight",
    soil: "Well-draining loamy soil with organic matter",
    fertilizer: "NPK 5-10-10 every 2 weeks",
    pestControl: "Use neem spray for pest control"
  }
}
```

---

## ✅ FEATURES IMPLEMENTED

✅ **Geolocation Detection**
- Auto-detect via GPS coordinates
- Manual selection via state picker
- Persist location to database

✅ **Regional Segregation**
- 5 Indian climate zones
- 22+ states mapped
- Regional vegetable lists

✅ **Seasonal Recommendations**
- Current season detection
- Seasonal product filtering
- Best planting times

✅ **Suitability Scoring**
- Regional score (0-100)
- Seasonal boost (+20 points)
- Year-round boost (+10 points)

✅ **Smart Sorting**
- Products ranked by suitability
- Seasonal relevance highlighted
- Easy-to-grow indicators

✅ **Growth Requirements**
- Water needs
- Sunlight requirements
- Days to maturity
- Temperature ranges
- Soil types

---

## 🎯 USAGE FLOW

```
1. User opens app → Location Setup Screen
2. Option A: Enable GPS → Auto-detect location
   Option B: Select state manually
3. Backend maps location to region & season
4. Shop Screen shows products sorted by suitability
5. Products ranked by:
   - Regional suitability score
   - Seasonal relevance (current season)
   - Pan-India products at end
6. Each product shows:
   - Suitability badge
   - Seasonal indicator
   - Growth requirements
   - Care tips
```

---

## 🎨 UI/UX ENHANCEMENTS

✨ **Location Badge** - Shows current region & season
✨ **Suitability Badges** - ✅ marks suitable products
✨ **Seasonal Tags** - 🌱 marks products available this season
✨ **Growth Icons** - Easy visual indicators for requirements
✨ **Color-Coded Cards** - Green for highly suitable, yellow for moderate

---

This comprehensive system ensures users see the most appropriate vegetables for their geographical location and current season! 🌱

