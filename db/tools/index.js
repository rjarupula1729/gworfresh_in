/* db/tools/index.js — unified tools catalog loader & helpers
 *
 * Mirrors the pattern of db/plants/index.js. Each sub-category lives in its
 * own JSON file so we can add/remove items without touching code. Works in
 * Node (CommonJS) and bundlers (webpack/vite/parcel) can statically inline
 * the JSON.
 */
const handTools   = require('./hand-tools.json');
const irrigation  = require('./irrigation.json');
const containers  = require('./containers.json');
const support     = require('./support.json');
const protection  = require('./protection.json');
const diagnostics = require('./diagnostics.json');
const propagation = require('./propagation.json');
const pestControl = require('./pest-control.json');
const safetyGear  = require('./safety-gear.json');

const ALL = [].concat(
  handTools, irrigation, containers, support, protection,
  diagnostics, propagation, pestControl, safetyGear
);

const SUBCATS = [
  { key: 'hand-tools',   label: '🪒 Hand Tools',   data: handTools },
  { key: 'irrigation',   label: '💧 Irrigation',   data: irrigation },
  { key: 'containers',   label: '🛍️ Containers',   data: containers },
  { key: 'support',      label: '🎍 Support',      data: support },
  { key: 'protection',   label: '☂️ Protection',   data: protection },
  { key: 'diagnostics',  label: '📟 Diagnostics',  data: diagnostics },
  { key: 'propagation',  label: '🌱 Propagation',  data: propagation },
  { key: 'pest-control', label: '🪤 Pest-Control', data: pestControl },
  { key: 'safety-gear',  label: '🧤 Safety',       data: safetyGear }
];

const byId = Object.create(null);
ALL.forEach(function(t){ byId[t.id] = t; });

function getById(id){ return byId[id] || null; }
function getBySubcat(subcat){ return ALL.filter(function(t){ return t.subcat === subcat; }); }
function getByTag(tag){ return ALL.filter(function(t){ return (t.tags||[]).indexOf(tag) >= 0; }); }

module.exports = { ALL, SUBCATS, getById, getBySubcat, getByTag };
