/* db/formulas/waterBudget.js
 *
 *   W(p) = (mlPerPlantPerDay / 1000) · 7 · κ_climate    [litres / plant / week]
 */
const CLIMATE_K = { tropical: 1.10, subtropical: 1.05, temperate: 1.00, humid: 0.85, arid: 1.20 };

function waterBudget(plant, env){
  const ml = plant && plant.mlPerPlantPerDay ? plant.mlPerPlantPerDay : 200;
  const k  = (env && env.climate && CLIMATE_K[env.climate]) || 1.0;
  return +((ml / 1000) * 7 * k).toFixed(2);   // litres / plant / week
}

/** Aggregate weekly water demand for an entire garden. */
function totalWaterBudget(gardenPlants, env){
  return +gardenPlants.reduce(function(sum, p){ return sum + waterBudget(p, env); }, 0).toFixed(2);
}

module.exports = { waterBudget, totalWaterBudget, _constants: { CLIMATE_K } };
