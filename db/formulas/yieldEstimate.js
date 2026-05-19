/* db/formulas/yieldEstimate.js
 *
 *   Y(p, env) = Y_base(p) · GrowScore(p, env)^1.5
 *
 * Returns expected harvest in kg per plant for one full crop cycle.
 */
const HARVEST_EXPONENT = 1.5;

function yieldEstimate(plant, growScore){
  const base = plant && plant.yieldKgPerPlant != null ? plant.yieldKgPerPlant : 0;
  const s = Math.max(0, Math.min(1, growScore));
  return +(base * Math.pow(s, HARVEST_EXPONENT)).toFixed(3);
}

module.exports = { yieldEstimate, _constants: { HARVEST_EXPONENT } };
