/* db/formulas/index.js
 *
 * Public façade. Pulls catalog + companion matrix + all formula modules
 * together and exposes the single most useful function:
 *
 *     recommendPlants(env, opts) → ranked array of plant suggestions
 *
 * Example:
 *     const { recommendPlants } = require('./db/formulas');
 *     const env = { sunHours: 6, tempC: 28, humidityPct: 60,
 *                   waterPerDayMl: 350, climate: 'tropical',
 *                   skill: 2, season: 'kharif' };
 *     const top = recommendPlants(env, { existingGarden: ['tomato'], top: 10 });
 */

const catalog        = require('../plants');
const companions     = require('../companions.json');
const growthMod      = require('./growthScore');
const yieldMod       = require('./yieldEstimate');
const waterMod       = require('./waterBudget');
const compScoreMod   = require('./companionScore');
const successMod     = require('./successProbability');

const { growthScore } = growthMod;
const { yieldEstimate } = yieldMod;
const { waterBudget, totalWaterBudget } = waterMod;
const { companionScore } = compScoreMod;
const { successProbability } = successMod;

/**
 * @param {object} env       Garden environment (see growthScore.js).
 * @param {object} [opts]    { existingGarden:string[], top:number=10,
 *                             category, region, season, climate, maxDifficulty,
 *                             containerOnly }
 * @returns {Array<{plant, score, yieldKg, waterLitresPerWeek, successPct, breakdown}>}
 */
function recommendPlants(env, opts){
  env = env || {};
  opts = opts || {};
  const garden = opts.existingGarden || [];
  // Apply hard filters first to shrink candidate set
  const pool = catalog.filterPlants({
    category:       opts.category,
    region:         opts.region,
    season:         opts.season || env.season,
    climate:        opts.climate || env.climate,
    maxDifficulty:  opts.maxDifficulty,
    containerOnly:  opts.containerOnly
  });

  const ctx = { gardenIds: garden, companionMatrix: companions };
  const ranked = pool.map(function(p){
    const g = growthScore(p, env, ctx);
    return {
      plant: p,
      score: +(g.score).toFixed(3),
      yieldKg: yieldEstimate(p, g.score),
      waterLitresPerWeek: waterBudget(p, env),
      successPct: Math.round(successProbability(g.score) * 100),
      breakdown: g.breakdown
    };
  });
  ranked.sort(function(a, b){ return b.score - a.score; });
  return opts.top ? ranked.slice(0, opts.top) : ranked;
}

/**
 * Score an entire garden layout — useful for "your garden health" dashboards.
 * @param {string[]} gardenIds
 * @param {object}   env
 */
function evaluateGarden(gardenIds, env){
  const plants = gardenIds.map(catalog.getById).filter(Boolean);
  const per = plants.map(function(p){
    const g = growthScore(p, env, { gardenIds, companionMatrix: companions });
    return {
      plant: p,
      score: +(g.score).toFixed(3),
      yieldKg: yieldEstimate(p, g.score),
      waterLitresPerWeek: waterBudget(p, env),
      successPct: Math.round(successProbability(g.score) * 100)
    };
  });
  return {
    plants: per,
    layoutSynergy: +(companionScore(gardenIds, companions)).toFixed(3),
    totalYieldKg: +per.reduce(function(s, x){ return s + x.yieldKg; }, 0).toFixed(2),
    totalWaterLitresPerWeek: totalWaterBudget(plants, env),
    averageScore: per.length ? +(per.reduce(function(s,x){return s+x.score;},0) / per.length).toFixed(3) : 0
  };
}

module.exports = {
  // Headline API
  recommendPlants,
  evaluateGarden,
  // Catalog re-exports
  catalog,
  companions,
  // Atomic formulas (exposed for unit tests and external tuning)
  growthScore,
  yieldEstimate,
  waterBudget,
  totalWaterBudget,
  companionScore,
  successProbability
};
