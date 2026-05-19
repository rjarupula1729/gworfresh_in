/* db/products/index.js — unified product catalog loader & helpers (Node)
 *
 * Mirrors db/plants/index.js and db/tools/index.js. Browser loading is
 * handled separately in shared/gf-app.js (_loadProductsDB).
 */
const seeds    = require('./seeds.json');
const saplings = require('./saplings.json');
const minerals = require('./minerals.json');
const compost  = require('./compost.json');
const tools    = require('../tools').ALL; // tools live in their own sub-categorised DB

const ALL = [].concat(seeds, saplings, minerals, compost, tools);

const byId = Object.create(null);
ALL.forEach(function(p){ byId[p.id] = p; });

function getById(id){ return byId[id] || null; }
function getByCat(cat){ return ALL.filter(function(p){ return p.cat === cat; }); }
function getByRegion(region){
  return ALL.filter(function(p){ return p.region === region || p.region === 'All India'; });
}

module.exports = {
  ALL, seeds, saplings, minerals, compost, tools,
  getById, getByCat, getByRegion
};
