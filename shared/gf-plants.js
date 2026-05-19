/* shared/gf-plants.js  —  browser bridge to db/ plant catalog + patent formulas.
 *
 * Exposes: window.GFPlants = {
 *     ready: Promise<void>,
 *     load(),                                  // (re)fetch JSON
 *     recommend(env, opts) → [ranked],
 *     evaluate(gardenIds, env) → summary,
 *     currentSeason(),
 *     getById(id), getByName(name)
 * }
 *
 * Source of truth = /db/plants/*.json + /db/companions.json (fetched once,
 * cached in memory + localStorage for 24h). Formulas are inlined here so the
 * page works even if /db isn't yet exposed (returns fast fallback).
 */
(function(){
  'use strict';
  if (window.GFPlants) return;

  /* ---------------- formulas (mirror of db/formulas/*.js) ---------------- */
  var SIGMA_SUN = 2.0, COMP_FLOOR = 0.70, COMP_CEIL = 1.30, SKILL_SLOPE_K = 1.2, SEASON_PENALTY = 0.4;
  var CLIMATE_K = { tropical:1.10, subtropical:1.05, temperate:1.00, humid:0.85, arid:1.20 };
  var HARVEST_EXP = 1.5, LOGIT_A = -2.4, LOGIT_B = 5.6;

  function sunFit(h, opt){ if(opt==null)return 1; var d=h-opt; return Math.exp(-(d*d)/(2*SIGMA_SUN*SIGMA_SUN)); }
  function tempFit(t, mn, op, mx){
    if(op==null)return 1;
    var span=Math.max(1, mx-mn); var dist=Math.abs(t-op);
    return Math.max(0, 1 - (dist/span)*2);
  }
  function waterFit(have, need){
    if(!need)return 1;
    var ratio=Math.abs(have-need)/need;
    return Math.max(0, 1 - Math.min(1, ratio));
  }
  function skillFit(diff, user){ var x=SKILL_SLOPE_K*((user||1)-(diff||1)); return 1/(1+Math.exp(-x)); }
  function companionBoost(id, garden, matrix){
    if(!garden||!garden.length)return 1;
    var logSum=0, n=0;
    for(var i=0;i<garden.length;i++){
      var q=garden[i]; if(!q||q===id) continue;
      var row=(matrix&&matrix[id])||{}; var rev=(matrix&&matrix[q])||{};
      var c = row[q]!=null ? row[q] : (rev[id]!=null ? rev[id] : 1.0);
      logSum += Math.log(c); n++;
    }
    if(!n) return 1;
    var b = Math.exp(logSum/n);
    return Math.max(COMP_FLOOR, Math.min(COMP_CEIL, b));
  }
  function seasonFactor(seasons, current){
    if(!seasons||!seasons.length) return 1;
    if(seasons.indexOf('year-round')>=0) return 1;
    return seasons.indexOf(current)>=0 ? 1 : SEASON_PENALTY;
  }
  /* Soil fit: 1.0 when user has not picked a soil. When picked, we compare
     the plant's soilType tags against the soil's tags + the soil's
     goodFor / weakFor lists. Range [0.55, 1.15]. */
  function soilFit(p, userSoil){
    if(!userSoil) return 1;
    var weak = (userSoil.weakFor||[]).map(String);
    var good = (userSoil.goodFor||[]).map(String);
    if(p.id && good.indexOf(p.id)>=0) return 1.15;
    if(p.category && good.indexOf(p.category)>=0) return 1.10;
    if(p.id && weak.indexOf(p.id)>=0) return 0.55;
    if(p.category && weak.indexOf(p.category)>=0) return 0.70;
    var soilTags = (userSoil.tags||[]).map(function(t){return String(t).toLowerCase();});
    var plantTags = (p.soilType||[]).map(function(t){return String(t).toLowerCase();});
    if(!plantTags.length || !soilTags.length) return 1;
    var hits = 0;
    plantTags.forEach(function(t){ if(soilTags.indexOf(t)>=0) hits++; });
    if(hits>=2) return 1.10;
    if(hits===1) return 1.0;
    // pH compatibility (if plant declares it)
    if(p.soilPHRange && userSoil.phRange){
      var pMid=(p.soilPHRange[0]+p.soilPHRange[1])/2, sMid=(userSoil.phRange[0]+userSoil.phRange[1])/2;
      var phDelta=Math.abs(pMid-sMid);
      if(phDelta<=0.5) return 0.95;
      if(phDelta<=1.0) return 0.85;
      return 0.70;
    }
    return 0.85;
  }
  function growthScore(p, env, ctx){
    env=env||{}; ctx=ctx||{};
    var fSun  = sunFit(env.sunHours != null ? env.sunHours : (p.sunHoursOptimal||p.sunHoursMin||6), p.sunHoursOptimal||p.sunHoursMin||6);
    var fTemp = tempFit(env.tempC != null ? env.tempC : p.tempOptimalC, p.tempMinC, p.tempOptimalC, p.tempMaxC);
    var fWtr  = waterFit(env.waterPerDayMl != null ? env.waterPerDayMl : p.mlPerPlantPerDay, p.mlPerPlantPerDay);
    var fSkl  = skillFit(p.difficulty, env.skill!=null?env.skill:3);
    var bComp = companionBoost(p.id, ctx.gardenIds, ctx.companionMatrix);
    var sSeas = seasonFactor(p.seasons, env.season);
    var fSoil = soilFit(p, ctx.userSoil);
    var s = fSun*fTemp*fWtr*fSkl*bComp*sSeas*fSoil;
    return { score: Math.max(0, Math.min(1.3, s)),
             breakdown:{fSun:fSun,fTemp:fTemp,fWater:fWtr,fSkill:fSkl,bComp:bComp,sSeason:sSeas,fSoil:fSoil} };
  }
  function yieldEstimate(p, s){
    var base = p && p.yieldKgPerPlant!=null ? p.yieldKgPerPlant : 0;
    s = Math.max(0, Math.min(1, s));
    return +(base * Math.pow(s, HARVEST_EXP)).toFixed(3);
  }
  function waterBudget(p, env){
    var ml = p && p.mlPerPlantPerDay ? p.mlPerPlantPerDay : 200;
    var k  = (env && env.climate && CLIMATE_K[env.climate]) || 1.0;
    return +((ml/1000)*7*k).toFixed(2);
  }
  function successProb(s){
    s = Math.max(0, Math.min(1, s));
    return +(1 / (1 + Math.exp(-(LOGIT_A + LOGIT_B*s)))).toFixed(3);
  }

  /* ---------------- catalog loading ---------------- */
  var BASE = 'db/';   // relative to current page
  var CACHE_KEY = 'gf_plants_cache_v5';   // bumped v4→v5 when soils DB added
  var CACHE_MS  = 24*60*60*1000;
  var state = { plants: [], byId: {}, byName: {}, companions: {}, soils: [], composts: [], minerals: [], weeds: [], loaded: false, lastError: null };

  function _index(plants){
    state.plants = plants;
    state.byId = Object.create(null);
    state.byName = Object.create(null);
    plants.forEach(function(p){
      state.byId[p.id] = p;
      if(p.name) state.byName[String(p.name).toLowerCase()] = p;
      (p.aliases||[]).forEach(function(a){ state.byName[String(a).toLowerCase()] = p; });
    });
    state.loaded = true;
  }

  function _fromCache(){
    try{
      var raw = localStorage.getItem(CACHE_KEY);
      if(!raw) return null;
      var obj = JSON.parse(raw);
      if(!obj || (Date.now() - (obj.ts||0)) > CACHE_MS) return null;
      return obj;
    }catch(_){ return null; }
  }
  function _saveCache(plants, companions){
    try{ localStorage.setItem(CACHE_KEY, JSON.stringify({ ts:Date.now(), plants:plants, companions:companions, soils:state.soils, composts:state.composts, minerals:state.minerals, weeds:state.weeds })); }catch(_){}
  }

  async function load(force){
    if(state.loaded && !force) return state;
    if(!force){
      var c = _fromCache();
      if(c && c.plants && c.plants.length){
        _index(c.plants);
        state.companions = c.companions||{};
        state.soils = c.soils||[]; state.composts = c.composts||[]; state.minerals = c.minerals||[]; state.weeds = c.weeds||[];
        return state;
      }
    }
    var files = ['plants/vegetables.json','plants/leafy.json','plants/herbs.json','plants/fruits.json','plants/flowers.json','plants/spices.json'];
    try{
      var results = await Promise.all(files.map(function(f){
        return fetch(BASE + f, { cache:'force-cache' }).then(function(r){
          if(!r.ok) throw new Error(f+' → HTTP '+r.status);
          return r.json();
        });
      }));
      var comp = await fetch(BASE + 'companions.json', { cache:'force-cache' }).then(function(r){ return r.ok ? r.json() : {}; }).catch(function(){ return {}; });
      // Soils / composts / minerals / weeds — non-fatal if any one fails.
      var soilFiles = [
        ['soils/india-soils.json','soils'],
        ['soils/compost-recipes.json','composts'],
        ['soils/mineral-amendments.json','minerals'],
        ['soils/weed-indicators.json','weeds']
      ];
      await Promise.all(soilFiles.map(function(pair){
        return fetch(BASE + pair[0], { cache:'force-cache' })
          .then(function(r){ return r.ok ? r.json() : []; })
          .then(function(j){ state[pair[1]] = Array.isArray(j) ? j : []; })
          .catch(function(){ state[pair[1]] = []; });
      }));
      var all = [].concat.apply([], results);
      if(!all.length) throw new Error('catalog empty after fetch');
      _index(all);
      state.companions = comp || {};
      _saveCache(all, state.companions);
      state.lastError = null;
    }catch(e){
      state.lastError = String(e && e.message || e);
      console.warn('[GFPlants] load failed:', state.lastError, '— pages must be served over http(s), not file://');
    }
    return state;
  }

  function currentSeason(d){
    d = d || new Date(); var m = d.getMonth()+1;
    if(m>=6 && m<=10) return 'kharif';
    if(m>=11 || m<=3) return 'rabi';
    return 'zaid';
  }

  function filterPlants(opts){
    opts = opts || {};
    return state.plants.filter(function(p){
      if(opts.category && p.category !== opts.category) return false;
      if(opts.season && (p.seasons||[]).indexOf(opts.season)<0 && (p.seasons||[]).indexOf('year-round')<0) return false;
      if(opts.climate && (p.climateZones||[]).indexOf(opts.climate)<0) return false;
      if(opts.region && (p.indiaRegions||[]).indexOf(opts.region)<0 && (p.indiaRegions||[]).indexOf('all')<0) return false;
      if(opts.maxDifficulty!=null && p.difficulty > opts.maxDifficulty) return false;
      if(opts.containerOnly && p.containerSizeL > 30) return false;
      return true;
    });
  }

  function recommend(env, opts){
    env = env || {}; opts = opts || {};
    if(!state.loaded || !state.plants.length) return [];
    // Try strict filter first, then relax progressively so we always show something.
    var attempts = [
      { category: opts.category, region: opts.region, season: opts.season || env.season, climate: opts.climate || env.climate, maxDifficulty: opts.maxDifficulty, containerOnly: opts.containerOnly },
      { category: opts.category, season: opts.season || env.season, climate: opts.climate || env.climate, containerOnly: opts.containerOnly },   // drop region + difficulty
      { category: opts.category, climate: opts.climate || env.climate },                                                                          // drop season
      { category: opts.category },                                                                                                                // category only
      {}                                                                                                                                          // last resort: all
    ];
    var pool = [];
    for(var i=0;i<attempts.length;i++){
      pool = filterPlants(attempts[i]);
      if(pool.length) break;
    }
    var ctx = { gardenIds: opts.existingGarden || [], companionMatrix: state.companions, userSoil: opts.userSoil || _resolveUserSoil() };
    var ranked = pool.map(function(p){
      var g = growthScore(p, env, ctx);
      return {
        plant: p,
        score: +g.score.toFixed(3),
        yieldKg: yieldEstimate(p, g.score),
        waterLitresPerWeek: waterBudget(p, env),
        successPct: Math.round(successProb(g.score)*100),
        breakdown: g.breakdown
      };
    });
    ranked.sort(function(a,b){ return b.score - a.score; });
    return opts.top ? ranked.slice(0, opts.top) : ranked;
  }

  function evaluate(gardenIds, env){
    if(!state.loaded) return null;
    var plants = (gardenIds||[]).map(function(id){ return state.byId[id]; }).filter(Boolean);
    var per = plants.map(function(p){
      var g = growthScore(p, env, { gardenIds: gardenIds, companionMatrix: state.companions });
      return { plant:p, score:+g.score.toFixed(3),
               yieldKg: yieldEstimate(p, g.score),
               waterLitresPerWeek: waterBudget(p, env),
               successPct: Math.round(successProb(g.score)*100) };
    });
    // garden synergy
    var totalPairs=0, companionPairs=0, antagonistPairs=0;
    for(var i=0;i<gardenIds.length;i++){
      for(var j=i+1;j<gardenIds.length;j++){
        var a=gardenIds[i], b=gardenIds[j]; totalPairs++;
        var c = ((state.companions[a]||{})[b]) || ((state.companions[b]||{})[a]) || 1.0;
        if(c>1.05) companionPairs++; else if(c<0.95) antagonistPairs++;
      }
    }
    var net = totalPairs ? (companionPairs - antagonistPairs)/totalPairs : 0;
    var synergy = Math.max(0, Math.min(1, 0.5 + net/2));
    return {
      plants: per,
      layoutSynergy: +synergy.toFixed(3),
      totalYieldKg: +per.reduce(function(s,x){return s+x.yieldKg;},0).toFixed(2),
      averageScore: per.length ? +(per.reduce(function(s,x){return s+x.score;},0)/per.length).toFixed(3) : 0
    };
  }

  /* ---------------- public API ---------------- */
  function _resolveUserSoil(){
    try{
      var id = localStorage.getItem('gf_user_soil') || null;
      if(!id || !state.soils.length) return null;
      for(var i=0;i<state.soils.length;i++){ if(state.soils[i].id===id) return state.soils[i]; }
    }catch(e){}
    return null;
  }
  function diagnoseWeed(weedId){
    if(!weedId) return null;
    var w = null;
    for(var i=0;i<state.weeds.length;i++){ if(state.weeds[i].id===weedId){ w=state.weeds[i]; break; } }
    if(!w) return null;
    var composts = (w.recommendComposts||[]).map(function(id){ return state.composts.find(function(c){return c.id===id;}); }).filter(Boolean);
    var minerals = (w.recommendMinerals||[]).map(function(id){ return state.minerals.find(function(m){return m.id===id;}); }).filter(Boolean);
    return { weed:w, composts:composts, minerals:minerals };
  }
  function suggestForSoil(soilId, env, opts){
    opts = opts || {};
    var soil = null;
    for(var i=0;i<state.soils.length;i++){ if(state.soils[i].id===soilId){ soil=state.soils[i]; break; } }
    if(!soil) return null;
    var picks = recommend(env || {}, { top: opts.top||5, existingGarden: opts.existingGarden||[], userSoil: soil });
    var composts = state.composts.filter(function(c){ return (c.goodForSoils||[]).indexOf(soilId)>=0 || (c.goodForSoils||[]).indexOf('all')>=0; }).slice(0,4);
    var minerals = state.minerals.filter(function(m){ return (m.goodForSoils||[]).indexOf(soilId)>=0; }).slice(0,4);
    return { soil:soil, picks:picks, composts:composts, minerals:minerals };
  }
  window.GFPlants = {
    load: load,
    recommend: recommend,
    evaluate: evaluate,
    currentSeason: currentSeason,
    getById: function(id){ return state.byId[id]||null; },
    getByName: function(n){ return n ? (state.byName[String(n).toLowerCase()]||null) : null; },
    all: function(){ return state.plants.slice(); },
    soils: function(){ return state.soils.slice(); },
    composts: function(){ return state.composts.slice(); },
    minerals: function(){ return state.minerals.slice(); },
    weeds: function(){ return state.weeds.slice(); },
    getSoil: function(id){ for(var i=0;i<state.soils.length;i++){ if(state.soils[i].id===id) return state.soils[i]; } return null; },
    diagnoseWeed: diagnoseWeed,
    suggestForSoil: suggestForSoil,
    setUserSoil: function(id){ try{ if(id) localStorage.setItem('gf_user_soil', id); else localStorage.removeItem('gf_user_soil'); }catch(e){} },
    getUserSoil: function(){ return _resolveUserSoil(); },
    _state: state
  };
  window.GFPlants.ready = load().catch(function(e){ console.warn('[GFPlants] load failed', e); });
})();
