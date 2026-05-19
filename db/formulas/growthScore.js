/* db/formulas/growthScore.js
 * --------------------------------------------------------------------------
 * Implements the multiplicative master "GrowScore" defined in db/README.md.
 *
 *   GrowScore(p, env, G) = f_sun · f_temp · f_water · f_skill · B_comp · s_season
 *
 * Every sub-factor is in [0, ~1.3] so the final score is also bounded. Pure
 * function — never reads from DOM / network / globals.
 * -------------------------------------------------------------------------- */

const SIGMA_SUN     = 2.0;  // hours
const COMP_FLOOR    = 0.70;
const COMP_CEIL     = 1.30;
const SKILL_SLOPE_K = 1.2;
const SEASON_PENALTY = 0.4; // applied when current season ∉ plant.seasons

/* ---------- atomic factors ---------- */

function sunFit(sunHours, optimal){
  if(optimal == null) return 1;
  const diff = sunHours - optimal;
  return Math.exp(-(diff*diff) / (2 * SIGMA_SUN * SIGMA_SUN));
}

function tempFit(tempC, tMin, tOpt, tMax){
  if(tOpt == null) return 1;
  const span = Math.max(1, tMax - tMin);
  const dist = Math.abs(tempC - tOpt);
  return Math.max(0, 1 - (dist / span) * 2);
}

/** waterAvailableMl is what the user can give per plant per day. */
function waterFit(waterAvailableMl, plantNeedMl){
  if(!plantNeedMl) return 1;
  const ratio = Math.abs(waterAvailableMl - plantNeedMl) / plantNeedMl;
  return Math.max(0, 1 - Math.min(1, ratio));
}

/** Sigmoid centred so a perfect skill match → 0.5; user well above difficulty → ~1. */
function skillFit(plantDifficulty, userSkill){
  const x = SKILL_SLOPE_K * ((userSkill || 1) - (plantDifficulty || 1));
  return 1 / (1 + Math.exp(-x));
}

/** Companion boost across a set of garden neighbours. */
function companionBoost(plantId, gardenIds, matrix){
  if(!gardenIds || !gardenIds.length) return 1;
  let logSum = 0;
  let n = 0;
  for(const q of gardenIds){
    if(!q || q === plantId) continue;
    const row = (matrix && matrix[plantId]) || {};
    const rev = (matrix && matrix[q]) || {};
    const c = row[q] != null ? row[q] : (rev[plantId] != null ? rev[plantId] : 1.0);
    logSum += Math.log(c);
    n++;
  }
  if(n === 0) return 1;
  const boost = Math.exp(logSum / n);
  return Math.max(COMP_FLOOR, Math.min(COMP_CEIL, boost));
}

function seasonFactor(plantSeasons, currentSeason){
  if(!plantSeasons || !plantSeasons.length) return 1;
  if(plantSeasons.includes('year-round')) return 1;
  return plantSeasons.includes(currentSeason) ? 1 : SEASON_PENALTY;
}

/* ---------- master score ---------- */

/**
 * @param {object} plant      One plant doc from db/plants/*
 * @param {object} env        { sunHours, tempC, waterPerDayMl, skill, season }
 * @param {object} ctx        { gardenIds:[], companionMatrix:{} }
 * @returns {object}          { score, breakdown }
 */
function growthScore(plant, env, ctx){
  env = env || {}; ctx = ctx || {};
  const fSun  = sunFit(env.sunHours ?? plant.sunHoursOptimal ?? plant.sunHoursMin ?? 6,
                       plant.sunHoursOptimal ?? plant.sunHoursMin ?? 6);
  const fTemp = tempFit(env.tempC ?? plant.tempOptimalC,
                        plant.tempMinC, plant.tempOptimalC, plant.tempMaxC);
  const fWtr  = waterFit(env.waterPerDayMl ?? plant.mlPerPlantPerDay,
                         plant.mlPerPlantPerDay);
  const fSkl  = skillFit(plant.difficulty, env.skill ?? 3);
  const bComp = companionBoost(plant.id, ctx.gardenIds, ctx.companionMatrix);
  const sSeas = seasonFactor(plant.seasons, env.season);
  const score = fSun * fTemp * fWtr * fSkl * bComp * sSeas;
  return {
    score: Math.max(0, Math.min(1.3, score)),
    breakdown: { fSun, fTemp, fWater: fWtr, fSkill: fSkl, bComp, sSeason: sSeas }
  };
}

module.exports = {
  growthScore,
  sunFit, tempFit, waterFit, skillFit, companionBoost, seasonFactor,
  _constants: { SIGMA_SUN, COMP_FLOOR, COMP_CEIL, SKILL_SLOPE_K, SEASON_PENALTY }
};
