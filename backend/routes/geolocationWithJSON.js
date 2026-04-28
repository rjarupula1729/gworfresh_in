// backend/routes/geolocation.js (Updated with JSON data)

const express = require('express');
const auth = require('../middleware/auth');
const UserLocation = require('../models/UserLocation');
const Product = require('../models/Product');
const {
  getRegions,
  getRegionById,
  getVegetablesByRegionAndSeason,
  getAllVegetablesByRegion,
  getAllRegionsVegetables,
  getSuitabilityScore,
  getCareInstructions
} = require('../utils/loadGeolocationData');

const router = express.Router();

// Helper function: Get current season
function getCurrentSeason(regionId) {
  const month = new Date().getMonth() + 1; // 1-12
  
  switch (regionId) {
    case 'north':
      if (month >= 3 && month <= 5) return 'summer';
      if (month >= 6 && month <= 9) return 'monsoon';
      return 'winter';
    
    case 'east':
      if (month >= 3 && month <= 5) return 'summer';
      if (month >= 6 && month <= 9) return 'monsoon';
      return 'winter';
    
    case 'south':
      if (month >= 6 && month <= 9) return 'monsoon';
      return 'summer';
    
    case 'west':
      if (month >= 3 && month <= 5) return 'summer';
      if (month >= 6 && month <= 9) return 'monsoon';
      return 'winter';
    
    case 'central':
      if (month >= 3 && month <= 5) return 'summer';
      if (month >= 6 && month <= 9) return 'monsoon';
      return 'winter';
    
    default:
      return 'moderate';
  }
}

// Helper function: Get region by coordinates
function getRegionByCoordinates(latitude, longitude) {
  if (latitude > 25) return getRegionById('north');
  if (latitude < 12) return getRegionById('south');
  if (longitude > 85) return getRegionById('east');
  if (longitude < 75) return getRegionById('west');
  return getRegionById('central');
}

// Helper function: Get region by state
function getRegionByState(state) {
  const regions = getRegions();
  for (const region of Object.values(regions)) {
    if (region.states.includes(state)) {
      return region;
    }
  }
  return getRegionById('central');
}

// ============================================
// 1. SET USER LOCATION (by coordinates)
// ============================================
router.post('/set-location-coordinates', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ msg: 'Latitude and longitude required' });
    }
    
    const region = getRegionByCoordinates(latitude, longitude);
    const season = getCurrentSeason(region.id);
    
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
    const season = getCurrentSeason(region.id);
    
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
// 4. GET SEASONAL VEGETABLES FOR REGION
// ============================================
router.get('/seasonal-vegetables', auth, async (req, res) => {
  try {
    const userLocation = await UserLocation.findOne({ userId: req.user.id });
    
    if (!userLocation) {
      return res.status(400).json({ msg: 'User location not set' });
    }
    
    const regionId = userLocation.region.id;
    const currentSeason = userLocation.season;
    
    // Get vegetables for this season in this region
    const seasonalVegetables = getVegetablesByRegionAndSeason(regionId, currentSeason);
    const allRegionVegetables = getAllRegionsVegetables();
    
    // Combine and add suitability scores
    const enrichedVegetables = [
      ...seasonalVegetables,
      ...allRegionVegetables
    ].map(veg => ({
      ...veg,
      suitability: getSuitabilityScore(regionId, veg.name),
      careInstructions: getCareInstructions(veg.name)
    }));
    
    res.json({
      region: userLocation.region,
      season: currentSeason,
      vegetables: enrichedVegetables,
      count: enrichedVegetables.length
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ============================================
// 5. GET ALL VEGETABLES FOR REGION
// ============================================
router.get('/all-vegetables-region', auth, async (req, res) => {
  try {
    const userLocation = await UserLocation.findOne({ userId: req.user.id });
    
    if (!userLocation) {
      return res.status(400).json({ msg: 'User location not set' });
    }
    
    const regionId = userLocation.region.id;
    
    // Get all vegetables for this region
    const allVegetables = getAllVegetablesByRegion(regionId);
    const allRegionVegetables = getAllRegionsVegetables();
    
    // Combine and add suitability scores
    const enrichedVegetables = [
      ...allVegetables,
      ...allRegionVegetables
    ].map(veg => ({
      ...veg,
      suitability: getSuitabilityScore(regionId, veg.name),
      careInstructions: getCareInstructions(veg.name)
    }));
    
    res.json({
      region: userLocation.region,
      vegetables: enrichedVegetables,
      count: enrichedVegetables.length
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ============================================
// 6. GET ALL REGIONS
// ============================================
router.get('/regions', (req, res) => {
  try {
    const regions = getRegions();
    const regionsList = Object.values(regions).map(region => ({
      id: region.id,
      name: region.name,
      icon: region.icon,
      climate: region.climate,
      states: region.states,
      temperature: region.temperature,
      rainfall: region.rainfall,
      description: region.description
    }));
    
    res.json(regionsList);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 7. GET SPECIFIC REGION DETAILS
// ============================================
router.get('/region/:regionId', (req, res) => {
  try {
    const { regionId } = req.params;
    const region = getRegionById(regionId);
    
    if (!region) {
      return res.status(404).json({ msg: 'Region not found' });
    }
    
    // Get vegetables for this region
    const allVegetables = getAllVegetablesByRegion(regionId);
    const allRegionVegetables = getAllRegionsVegetables();
    
    res.json({
      region: region,
      vegetables: [...allVegetables, ...allRegionVegetables],
      vegetableCount: allVegetables.length + allRegionVegetables.length
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 8. GET VEGETABLES FOR SEASON
// ============================================
router.get('/vegetables/:regionId/:season', (req, res) => {
  try {
    const { regionId, season } = req.params;
    const vegetables = getVegetablesByRegionAndSeason(regionId, season);
    
    if (!vegetables || vegetables.length === 0) {
      return res.json({ vegetables: [], count: 0 });
    }
    
    // Add suitability scores and care instructions
    const enrichedVegetables = vegetables.map(veg => ({
      ...veg,
      suitability: getSuitabilityScore(regionId, veg.name),
      careInstructions: getCareInstructions(veg.name)
    }));
    
    res.json({
      region: regionId,
      season: season,
      vegetables: enrichedVegetables,
      count: enrichedVegetables.length
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 9. GET CARE INSTRUCTIONS
// ============================================
router.get('/care-instructions/:vegetableName', (req, res) => {
  try {
    const { vegetableName } = req.params;
    const instructions = getCareInstructions(vegetableName);
    
    if (!instructions || Object.keys(instructions).length === 0) {
      return res.status(404).json({ msg: 'Care instructions not found' });
    }
    
    res.json({
      vegetable: vegetableName,
      instructions: instructions
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 10. SEARCH VEGETABLES ACROSS REGIONS
// ============================================
router.post('/search-vegetables', (req, res) => {
  try {
    const { vegetableName, regions: selectedRegions } = req.body;
    
    if (!vegetableName) {
      return res.status(400).json({ msg: 'Vegetable name required' });
    }
    
    const allRegions = getRegions();
    const results = [];
    
    // Search in each region
    Object.keys(allRegions).forEach(regionId => {
      if (selectedRegions && !selectedRegions.includes(regionId)) return;
      
      const allVegetables = getAllVegetablesByRegion(regionId);
      const allRegionVegetables = getAllRegionsVegetables();
      
      const found = [
        ...allVegetables,
        ...allRegionVegetables
      ].find(veg => veg.name.toLowerCase() === vegetableName.toLowerCase());
      
      if (found) {
        results.push({
          region: allRegions[regionId].name,
          regionId: regionId,
          vegetable: found,
          suitability: getSuitabilityScore(regionId, found.name)
        });
      }
    });
    
    res.json({
      search: vegetableName,
      resultsCount: results.length,
      results: results
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================================
// 11. GET ALL REGIONS VEGETABLES
// ============================================
router.get('/all-regions-vegetables', (req, res) => {
  try {
    const vegetables = getAllRegionsVegetables();
    
    const enrichedVegetables = vegetables.map(veg => ({
      ...veg,
      careInstructions: getCareInstructions(veg.name)
    }));
    
    res.json({
      vegetables: enrichedVegetables,
      count: enrichedVegetables.length,
      message: 'These vegetables can be grown in all Indian regions'
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
