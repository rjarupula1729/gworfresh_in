/* db/climate/index.js — climate zones + state mapping + RD buckets (Node) */
const zones    = require('./zones.json');
const stateZone = require('./state-zone-map.json');
const rdBuckets = require('./rd-buckets.json');

function zoneForState(stateName){ return stateZone[stateName] || null; }
function zoneInfo(zoneKey){ return zones[zoneKey] || null; }
function bucketFor(n){
  var v = Math.max(10, Math.min(20000, Number(n) || 0));
  for (var i=0;i<rdBuckets.length;i++) if (v <= rdBuckets[i].max) return rdBuckets[i];
  return rdBuckets[rdBuckets.length-1];
}

module.exports = { zones, stateZone, rdBuckets, zoneForState, zoneInfo, bucketFor };
