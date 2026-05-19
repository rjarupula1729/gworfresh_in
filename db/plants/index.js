/* db/plants/index.js — unified catalog loader & lookup helpers
 *
 * Works in both Node (CommonJS) and the browser (ES modules / global).
 * No external deps. Plant JSON files are required statically so bundlers
 * (webpack/vite/parcel) can tree-shake / inline them.
 */
const vegetables = require('./vegetables.json');
const leafy      = require('./leafy.json');
const herbs      = require('./herbs.json');
const fruits     = require('./fruits.json');

const ALL = [].concat(vegetables, leafy, herbs, fruits);

// Build O(1) lookup map by id and by lowercased name/alias
const byId = Object.create(null);
const byName = Object.create(null);
ALL.forEach(function(p){
  byId[p.id] = p;
  byName[String(p.name).toLowerCase()] = p;
  (p.aliases||[]).forEach(function(a){ byName[String(a).toLowerCase()] = p; });
});

/** Get a plant by exact id (slug). */
function getById(id){ return byId[id] || null; }

/** Get a plant by case-insensitive name or alias. */
function getByName(name){
  if(!name) return null;
  return byName[String(name).toLowerCase()] || null;
}

/** Filter the catalog by category / region / season / climate. */
function filterPlants(opts){
  opts = opts || {};
  return ALL.filter(function(p){
    if(opts.category   && p.category   !== opts.category) return false;
    if(opts.season     && !(p.seasons||[]).includes(opts.season) && !(p.seasons||[]).includes('year-round')) return false;
    if(opts.climate    && !(p.climateZones||[]).includes(opts.climate)) return false;
    if(opts.region     && !(p.indiaRegions||[]).includes(opts.region) && !(p.indiaRegions||[]).includes('all')) return false;
    if(opts.maxDifficulty != null && p.difficulty > opts.maxDifficulty) return false;
    if(opts.containerOnly && p.containerSizeL > 30) return false;
    return true;
  });
}

/** Return current India agricultural season for a given Date. */
function currentSeason(d){
  d = d || new Date();
  var m = d.getMonth() + 1; // 1..12
  if(m >= 6  && m <= 10) return 'kharif';   // Jun-Oct: monsoon crops
  if(m >= 11 || m <= 3)  return 'rabi';     // Nov-Mar: winter crops
  return 'zaid';                            // Apr-May: summer crops
}

module.exports = {
  ALL: ALL,
  vegetables: vegetables,
  leafy: leafy,
  herbs: herbs,
  fruits: fruits,
  getById: getById,
  getByName: getByName,
  filterPlants: filterPlants,
  currentSeason: currentSeason
};
