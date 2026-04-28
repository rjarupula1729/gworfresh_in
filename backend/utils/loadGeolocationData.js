// backend/utils/loadGeolocationData.js

const fs = require('fs');
const path = require('path');

/**
 * Load geolocation data from JSON file
 * @returns {Object} Geolocation data object
 */
function loadGeolocationData() {
  try {
    const dataPath = path.join(__dirname, '../data/geolocationData.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error loading geolocation data:', error);
    return null;
  }
}

/**
 * Get all regions
 * @returns {Object} Regions object
 */
function getRegions() {
  const data = loadGeolocationData();
  return data?.regions || {};
}

/**
 * Get a specific region by ID
 * @param {String} regionId - Region ID (north, south, east, west, central)
 * @returns {Object} Region object
 */
function getRegionById(regionId) {
  const regions = getRegions();
  return regions[regionId] || null;
}

/**
 * Get vegetables for a specific region and season
 * @param {String} regionId - Region ID
 * @param {String} season - Season (summer, monsoon, winter, yearRound)
 * @returns {Array} Vegetables array
 */
function getVegetablesByRegionAndSeason(regionId, season) {
  const data = loadGeolocationData();
  const vegetables = data?.regionalVegetables?.[regionId];
  
  if (!vegetables) return [];
  
  // Convert season to camelCase for allRegions
  let seasonKey = season;
  if (season === 'year-round') {
    seasonKey = 'yearRound';
  }
  
  return vegetables[seasonKey] || [];
}

/**
 * Get all vegetables for a region
 * @param {String} regionId - Region ID
 * @returns {Array} All vegetables array
 */
function getAllVegetablesByRegion(regionId) {
  const data = loadGeolocationData();
  const vegetables = data?.regionalVegetables?.[regionId];
  
  if (!vegetables) return [];
  
  // Combine all seasons
  const allVegetables = [
    ...(vegetables.summer || []),
    ...(vegetables.monsoon || []),
    ...(vegetables.winter || []),
    ...(vegetables.yearRound || [])
  ];
  
  return allVegetables;
}

/**
 * Get all-regions vegetables (available everywhere)
 * @returns {Array} All-regions vegetables
 */
function getAllRegionsVegetables() {
  const data = loadGeolocationData();
  return data?.regionalVegetables?.allRegions || [];
}

/**
 * Get suitability score for a vegetable in a region
 * @param {String} regionId - Region ID
 * @param {String} vegetableName - Vegetable name
 * @returns {Object} Suitability object with score and reason
 */
function getSuitabilityScore(regionId, vegetableName) {
  const data = loadGeolocationData();
  const scores = data?.suitabilityScores?.[regionId];
  
  return scores?.[vegetableName] || { score: 50, reason: 'Suitable' };
}

/**
 * Get care instructions for a vegetable
 * @param {String} vegetableName - Vegetable name
 * @returns {Object} Care instructions object
 */
function getCareInstructions(vegetableName) {
  const data = loadGeolocationData();
  return data?.careInstructions?.[vegetableName] || {};
}

/**
 * Get difficulty levels reference
 * @returns {Object} Difficulty levels object
 */
function getDifficultyLevels() {
  const data = loadGeolocationData();
  return data?.difficultyLevels || {};
}

/**
 * Get difficulty level for a specific level
 * @param {String} level - Difficulty level (veryEasy, easy, medium, hard)
 * @returns {Object} Difficulty level object
 */
function getDifficultyLevel(level) {
  const levels = getDifficultyLevels();
  
  // Convert to camelCase
  const levelKey = level.replace(/-/g, '');
  return levels[levelKey] || null;
}

/**
 * Get all data
 * @returns {Object} Complete geolocation data
 */
function getAllData() {
  return loadGeolocationData();
}

module.exports = {
  loadGeolocationData,
  getRegions,
  getRegionById,
  getVegetablesByRegionAndSeason,
  getAllVegetablesByRegion,
  getAllRegionsVegetables,
  getSuitabilityScore,
  getCareInstructions,
  getDifficultyLevels,
  getDifficultyLevel,
  getAllData
};
