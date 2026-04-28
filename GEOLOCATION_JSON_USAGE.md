# 📋 GEOLOCATION JSON DATA - USAGE GUIDE

---

## 📂 File Structure

```
gworfresh_in/
├── backend/
│   ├── data/
│   │   └── geolocationData.json          ← Main data file
│   ├── utils/
│   │   └── loadGeolocationData.js        ← Helper functions
│   ├── routes/
│   │   ├── geolocation.js                ← Route handlers
│   │   └── geolocationWithJSON.js        ← Updated routes with JSON
│   └── models/
│       └── UserLocation.js
```

---

## 🎯 Using the Data in Backend

### Option 1: Use Helper Functions (Recommended)

```javascript
// Import helper functions
const {
  getRegions,
  getRegionById,
  getVegetablesByRegionAndSeason,
  getAllVegetablesByRegion,
  getAllRegionsVegetables,
  getSuitabilityScore,
  getCareInstructions,
  getDifficultyLevels
} = require('../utils/loadGeolocationData');

// Get all regions
const allRegions = getRegions();
// Output:
// {
//   "north": { id, name, climate, states, temperature, ... },
//   "south": { id, name, climate, states, temperature, ... },
//   ...
// }

// Get a specific region
const northRegion = getRegionById('north');
// Output: { id: "north", name: "Northern Region", ... }

// Get vegetables for region & season
const summerVegetables = getVegetablesByRegionAndSeason('north', 'summer');
// Output: [{ name: "Tomato", emoji: "🍅", waterNeed: "high", ... }, ...]

// Get all vegetables for a region
const allNorthVegetables = getAllVegetablesByRegion('north');
// Output: All vegetables (all seasons combined)

// Get all-regions vegetables
const ubiquitousVegetables = getAllRegionsVegetables();
// Output: [{ name: "Mint", emoji: "🌿", ... }, ...]

// Get suitability score
const tomatoScore = getSuitabilityScore('north', 'Tomato');
// Output: { score: 85, reason: "Excellent for north India..." }

// Get care instructions
const tomatoCare = getCareInstructions('Tomato');
// Output: { watering: "...", sunlight: "...", soil: "...", ... }
```

### Option 2: Direct JSON Loading

```javascript
const { loadGeolocationData } = require('../utils/loadGeolocationData');

const data = loadGeolocationData();
console.log(data.regions.north);
console.log(data.regionalVegetables.north.summer);
console.log(data.careInstructions.Tomato);
```

---

## 🔌 API Endpoints

### 1. Get All Regions
```bash
GET /api/geolocation/regions
```
**Response:**
```json
[
  {
    "id": "north",
    "name": "Northern Region",
    "icon": "❄️",
    "climate": "temperate",
    "states": ["Punjab", "Haryana", ...],
    "temperature": { "min": -5, "max": 35 }
  }
]
```

### 2. Get Specific Region Details
```bash
GET /api/geolocation/region/:regionId
```
**Example:** `GET /api/geolocation/region/north`

**Response:**
```json
{
  "region": { id, name, climate, ... },
  "vegetables": [...],
  "vegetableCount": 45
}
```

### 3. Get Seasonal Vegetables (User Location)
```bash
GET /api/geolocation/seasonal-vegetables
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "region": { "id": "north", "name": "Northern Region" },
  "season": "winter",
  "vegetables": [
    {
      "name": "Spinach",
      "emoji": "🥬",
      "waterNeed": "moderate",
      "daysToMaturity": 45,
      "suitability": { "score": 90, "reason": "Perfect for winter..." },
      "careInstructions": { "watering": "...", "sunlight": "..." }
    }
  ],
  "count": 12
}
```

### 4. Get Vegetables for Specific Season & Region
```bash
GET /api/geolocation/vegetables/:regionId/:season
```
**Example:** `GET /api/geolocation/vegetables/north/winter`

**Response:**
```json
{
  "region": "north",
  "season": "winter",
  "vegetables": [...],
  "count": 8
}
```

### 5. Get Care Instructions
```bash
GET /api/geolocation/care-instructions/:vegetableName
```
**Example:** `GET /api/geolocation/care-instructions/Tomato`

**Response:**
```json
{
  "vegetable": "Tomato",
  "instructions": {
    "watering": "Water deeply 2-3 times per week...",
    "sunlight": "Requires 6-8 hours of direct sunlight...",
    "soil": "Well-draining loamy soil...",
    "fertilizer": "NPK 5-10-10 every 2 weeks",
    "pestControl": "Use neem spray...",
    "staking": "Support with stakes..."
  }
}
```

### 6. Search Vegetables Across Regions
```bash
POST /api/geolocation/search-vegetables
```
**Request Body:**
```json
{
  "vegetableName": "Tomato",
  "regions": ["north", "south", "central"]
}
```

**Response:**
```json
{
  "search": "Tomato",
  "resultsCount": 5,
  "results": [
    {
      "region": "Northern Region",
      "regionId": "north",
      "vegetable": { name, emoji, waterNeed, ... },
      "suitability": { score: 85, reason: "..." }
    }
  ]
}
```

### 7. Get All Regions Vegetables
```bash
GET /api/geolocation/all-regions-vegetables
```

**Response:**
```json
{
  "vegetables": [
    {
      "name": "Mint",
      "emoji": "🌿",
      "waterNeed": "moderate",
      "difficulty": "very-easy",
      "careInstructions": { ... }
    }
  ],
  "count": 6,
  "message": "These vegetables can be grown in all Indian regions"
}
```

---

## 🌾 JSON Data Structure

### Regions Object
```json
{
  "regions": {
    "north": {
      "id": "north",
      "name": "Northern Region",
      "icon": "❄️",
      "climate": "temperate",
      "season": "winter",
      "states": ["Punjab", "Haryana", "..."],
      "temperature": { "min": -5, "max": 35 },
      "rainfall": "moderate",
      "description": "..."
    }
  }
}
```

### Regional Vegetables
```json
{
  "regionalVegetables": {
    "north": {
      "summer": [
        {
          "name": "Tomato",
          "emoji": "🍅",
          "waterNeed": "high",
          "sunlight": "full",
          "daysToMaturity": 60,
          "temperature": { "min": 21, "max": 32 },
          "difficulty": "medium",
          "yield": "high",
          "soilType": "loamy"
        }
      ],
      "monsoon": [...],
      "winter": [...],
      "yearRound": [...]
    }
  }
}
```

### Vegetable Properties
- `name` (string) - Vegetable name
- `emoji` (string) - Visual icon
- `waterNeed` (enum) - low, moderate, high, very-high
- `sunlight` (enum) - full, partial, shade
- `daysToMaturity` (number) - Days to harvest
- `temperature` (object) - Min/max temperature
- `difficulty` (string) - very-easy, easy, medium, hard
- `yield` (string) - medium, high, very-high
- `soilType` (string) - loamy, clay, sandy, mixed

### Suitability Scores
```json
{
  "suitabilityScores": {
    "north": {
      "Tomato": {
        "score": 85,
        "reason": "Excellent for north India, grows well in both summer and winter"
      }
    }
  }
}
```

### Care Instructions
```json
{
  "careInstructions": {
    "Tomato": {
      "watering": "Water deeply 2-3 times per week...",
      "sunlight": "Requires 6-8 hours of direct sunlight...",
      "soil": "Well-draining loamy soil with organic matter",
      "fertilizer": "NPK 5-10-10 every 2 weeks",
      "pestControl": "Use neem spray for pest control...",
      "staking": "Support with stakes or cages as plant grows"
    }
  }
}
```

---

## 💻 Frontend Usage

### In React Native Components

```javascript
import API from '../services/api';

// Get seasonal vegetables
async function loadSeasonalVegetables() {
  try {
    const response = await API.get('/geolocation/seasonal-vegetables');
    setVegetables(response.data.vegetables);
    setRegion(response.data.region);
    setSeason(response.data.season);
  } catch (err) {
    console.error('Error loading vegetables:', err);
  }
}

// Get care instructions
async function loadCareGuide(vegetableName) {
  try {
    const response = await API.get(`/geolocation/care-instructions/${vegetableName}`);
    setCareGuide(response.data.instructions);
  } catch (err) {
    console.error('Error loading care guide:', err);
  }
}

// Search vegetables
async function searchVegetable(name) {
  try {
    const response = await API.post('/geolocation/search-vegetables', {
      vegetableName: name,
      regions: ['north', 'south', 'east', 'west', 'central']
    });
    setSearchResults(response.data.results);
  } catch (err) {
    console.error('Error searching:', err);
  }
}
```

---

## 📊 Sample Data Queries

### Get North India Summer Vegetables
```javascript
const northSummerVegetables = getVegetablesByRegionAndSeason('north', 'summer');
// Returns: [Tomato, Cucumber, Bottle Gourd, Carrot, Okra]
```

### Get All-Regions Vegetables
```javascript
const ubiquitousVegetables = getAllRegionsVegetables();
// Returns: [Mint, Coriander, Basil, Lemon, Turmeric, Ginger]
```

### Get Vegetables with Full Details
```javascript
const region = 'south';
const season = 'monsoon';

const vegetables = getVegetablesByRegionAndSeason(region, season);

const detailed = vegetables.map(veg => ({
  ...veg,
  suitability: getSuitabilityScore(region, veg.name),
  care: getCareInstructions(veg.name)
}));

// Returns complete information for each vegetable
```

---

## 🔍 Data Statistics

### Total Data Points
- **Regions:** 5 (North, South, East, West, Central)
- **States:** 22
- **Regional Vegetables:** 60+ (varies by region & season)
- **All-Regions Vegetables:** 6 (available everywhere)
- **Total Vegetables:** 65+
- **Suitability Scores:** 50+ (region x vegetable combinations)
- **Care Instructions:** 20+ detailed guides
- **Difficulty Levels:** 4 (Very Easy, Easy, Medium, Hard)

---

## ✅ Integration Checklist

- [ ] Copy `geolocationData.json` to `backend/data/`
- [ ] Copy `loadGeolocationData.js` to `backend/utils/`
- [ ] Update `backend/routes/geolocation.js` with new functions
- [ ] Add `app.use('/api/geolocation', require('./routes/geolocation'));` to `server.js`
- [ ] Test endpoints in Postman/Insomnia
- [ ] Update frontend components to use new endpoints
- [ ] Add UserLocation model to database
- [ ] Test location setup and product filtering

---

## 🎨 Example: Complete Workflow

```javascript
// Step 1: User sets location
POST /api/geolocation/set-location-state
{
  "state": "Punjab"
}
// Response: { msg: "Location set", region: {...}, season: "winter" }

// Step 2: Get seasonal vegetables
GET /api/geolocation/seasonal-vegetables
// Response: { region: {...}, season: "winter", vegetables: [...] }

// Step 3: User clicks on Spinach
GET /api/geolocation/care-instructions/Spinach
// Response: { vegetable: "Spinach", instructions: {...} }

// Step 4: User searches across regions
POST /api/geolocation/search-vegetables
{
  "vegetableName": "Tomato",
  "regions": ["north", "south", "central"]
}
// Response: { search: "Tomato", results: [...] }
```

---

## 🚀 Performance Tips

1. **Cache the JSON data** - Load once on server startup
2. **Use indexes** on MongoDB queries
3. **Implement pagination** for large result sets
4. **Cache API responses** on frontend (30 min)
5. **Lazy load** care instructions on demand

---

## 🔧 Extending the Data

To add more vegetables:

```json
{
  "name": "NewVegetable",
  "emoji": "🔷",
  "waterNeed": "high",
  "sunlight": "full",
  "daysToMaturity": 60,
  "temperature": { "min": 15, "max": 30 },
  "difficulty": "easy",
  "yield": "high",
  "soilType": "loamy"
}
```

Then update suitability scores:

```json
"NewVegetable": {
  "score": 85,
  "reason": "Description of why it's suitable"
}
```

And care instructions:

```json
"NewVegetable": {
  "watering": "...",
  "sunlight": "...",
  "soil": "...",
  "fertilizer": "...",
  "pestControl": "..."
}
```

---

## 📝 Notes

- All data is region-specific and season-aware
- Suitability scores range from 0-100
- Difficulty levels help users choose appropriate plants
- Care instructions are comprehensive and practical
- Data is based on Indian agricultural practices
- All temperatures in Celsius

