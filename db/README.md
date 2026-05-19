# GrowFresh Plant DB & Formula Engine

A pure-data + pure-function package powering the **patent-book mathematical
model** for home-garden plant recommendations, yield prediction, water-budget
estimation and companion-planting optimisation.

```
db/
├── README.md                  ← you are here
├── schemas/
│   └── plant.schema.json      ← JSON Schema (draft-07) for every plant doc
├── plants/
│   ├── vegetables.json        ← 30+ fruiting & root vegetables
│   ├── leafy.json             ← 15+ leafy greens
│   ├── herbs.json             ← 15+ culinary herbs
│   ├── fruits.json            ← 10+ home-growable fruits
│   └── index.js               ← unified catalog loader + helpers
├── companions.json            ← O(n²) companion / antagonist matrix
└── formulas/
    ├── index.js               ← public API (recommendPlants, ranks, etc.)
    ├── growthScore.js         ← per-plant suitability score
    ├── yieldEstimate.js       ← kg per plant per season
    ├── waterBudget.js         ← litres per plant per week
    ├── companionScore.js      ← garden-level synergy score
    └── successProbability.js  ← logistic-fit success likelihood
```

## Why a separate `db/` folder?

* **Source of truth**: same dataset is consumed by the backend (`/api/plants`,
  `/api/recommend`) AND by the frontend (`shared/gf-plants.js` re-exports it
  for client-side ranking with no network round-trip).
* **No DB engine dependency**: lives as JSON so it's grep-able, diff-able,
  PR-reviewable, and trivially re-importable into Postgres / SQLite / Mongo
  via `db/plants/index.js` → `loadAllPlants()`.
* **Formula isolation**: every coefficient lives in one place
  (`formulas/*.js`), so tuning the patent-book model never touches data.

---

## The Plant Document Schema (summary)

Every plant in `plants/*.json` conforms to `schemas/plant.schema.json`.
Required fields are marked **★**.

| field                    | type                | example                          |
|--------------------------|---------------------|----------------------------------|
| ★ `id`                   | string (slug)       | `"tomato-cherry"`                |
| ★ `name`                 | string              | `"Cherry Tomato"`                |
| `aliases`                | string[]            | `["Sannakaya","छोटा टमाटर"]`     |
| ★ `category`             | enum                | `"vegetable"`/`"leafy"`/`"herb"`/`"fruit"` |
| ★ `emoji`                | string              | `"🍅"`                            |
| ★ `family`               | string              | `"Solanaceae"`                   |
| ★ `difficulty`           | int 1-5             | `2`                              |
| **Time**                 |                     |                                  |
| ★ `daysToGerminate`      | int                 | `7`                              |
| ★ `daysToHarvest`        | int                 | `60`                             |
| `harvestWindowDays`      | int                 | `90`                             |
| **Light & climate**      |                     |                                  |
| ★ `sunHoursMin`          | number              | `6`                              |
| `sunHoursOptimal`        | number              | `8`                              |
| ★ `tempMinC`             | number              | `15`                             |
| ★ `tempOptimalC`         | number              | `24`                             |
| ★ `tempMaxC`             | number              | `35`                             |
| `humidityPctRange`       | [number,number]     | `[40,70]`                        |
| **Water & soil**         |                     |                                  |
| ★ `waterNeed`            | enum (low/med/high) | `"medium"`                       |
| ★ `mlPerPlantPerDay`     | number              | `350`                            |
| `soilPHRange`            | [number,number]     | `[6.0,6.8]`                      |
| `soilType`               | string[]            | `["loamy","well-drained"]`       |
| **Space**                |                     |                                  |
| ★ `spacingCm`            | number              | `45`                             |
| `depthCm`                | number              | `30`                             |
| `containerSizeL`         | number              | `10`                             |
| **Nutrition (per 100g)** |                     |                                  |
| `kcal` `proteinG` `fiberG` `vitCmg` `ironMg` | number  | numerical|
| **Region (India)**       |                     |                                  |
| `seasons`                | string[]            | `["rabi","zaid","kharif"]`       |
| `climateZones`           | string[]            | `["tropical","subtropical"]`     |
| `indiaRegions`           | string[]            | `["south","west","central"]`     |
| **Yield**                |                     |                                  |
| `yieldKgPerPlant`        | number              | `2.5`                            |
| **Pests & companions**   |                     |                                  |
| `commonPests`            | string[]            | `["aphids","whitefly"]`          |
| `commonDiseases`         | string[]            | `["blight","powdery mildew"]`    |
| `companions`             | string[]            | `["basil","marigold","carrot"]`  |
| `antagonists`            | string[]            | `["fennel","cabbage"]`           |

---

## The Mathematical Model

All formulas are pure functions: `(plant, env) → number ∈ [0,1]` (or a
physical unit like kg / litres). Easy to unit-test, easy to memoise.

### 1. Sun-fit (Gaussian fall-off around optimum)

$$ f_{\text{sun}}(s) = \exp\left(-\frac{(s - s^*)^2}{2\sigma_{\text{sun}}^2}\right) $$

where `s` is the user's available sun hours, `s*` is `sunHoursOptimal`,
and `σ_sun = 2.0` h. Implemented in `formulas/growthScore.js`.

### 2. Temperature-fit (triangular kernel)

$$ f_{\text{temp}}(T) = \max\!\left(0,\; 1 - \frac{|T - T^*|}{T_{\max} - T_{\min}} \cdot 2\right) $$

### 3. Water-fit (linear penalty for mismatch)

$$ f_{\text{water}}(w) = 1 - \min\!\left(1,\; \frac{|w - w_{\text{plant}}|}{w_{\text{plant}}}\right) $$

### 4. Companion boost (geometric mean over neighbours)

$$ B_{\text{comp}}(p, G) = \prod_{q \in G} c(p, q)^{1/|G|} $$

`c(p,q) ∈ {0.85, 1.0, 1.15}` for antagonist / neutral / companion. Capped at
`[0.7, 1.3]` so it can never dominate the score.

### 5. Difficulty penalty (sigmoid against user skill)

$$ f_{\text{skill}}(d, u) = \sigma\!\big( k \cdot (u - d) \big),\; k=1.2 $$

`u ∈ [1,5]` is the user's gardening level, `d` is `plant.difficulty`.

### 6. **Master growth score** (multiplicative)

$$ \boxed{\; \text{GrowScore}(p, env, G) = f_{\text{sun}} \cdot f_{\text{temp}} \cdot f_{\text{water}} \cdot f_{\text{skill}} \cdot B_{\text{comp}} \cdot s_{\text{season}} \;} $$

`s_season ∈ {0.4, 1.0}` is `0.4` if the current month is outside the plant's
sowing seasons, else `1.0`.

### 7. Yield estimate

$$ Y(p, env) = Y_{\text{base}}(p) \cdot \text{GrowScore}(p, env)^{1.5} $$

The exponent `>1` is the patent-book "harvest multiplier": good conditions
disproportionately reward yield.

### 8. Weekly water budget

$$ W(p) = \frac{\text{mlPerPlantPerDay}}{1000} \cdot 7 \cdot \kappa_{\text{climate}} $$

`κ` is `1.2` for hot/dry climates, `1.0` for temperate, `0.8` for humid.

### 9. Success probability (calibrated logistic)

$$ P_{\text{success}} = \frac{1}{1 + e^{-(a + b \cdot \text{GrowScore})}} $$

defaults: `a = -2.4`, `b = 5.6` (≈ 50% at score 0.43, ≈ 90% at score 0.83).

---

## Public API

```js
import { recommendPlants, growthScore, yieldEstimate, waterBudget } from './db/formulas';

const env = { sunHours:7, tempC:28, humidityPct:55, waterPerDayMl:300,
              climate:'tropical', skill:2, season:'kharif' };

const garden = ['tomato-cherry','basil-sweet'];
const ranked = recommendPlants(env, { existingGarden: garden, top: 10 });
// → [{ plant, score, yieldKg, waterLitresPerWeek, successPct }, …]
```

---

## Adding a new plant

1. Drop a new entry into the appropriate `plants/*.json` file.
2. Validate against `schemas/plant.schema.json` (`npm run db:validate`).
3. Add bidirectional companion/antagonist edges to `companions.json` if
   needed (the loader auto-mirrors single-direction entries, but explicit
   is better than implicit).
4. Re-run unit tests in `formulas/__tests__/`.
