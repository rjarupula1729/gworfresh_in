# 🛠️ GrowFresh Tools Database

Tools / equipment catalog for the GrowFresh Shop, organised by **sub-category** —
mirrors the structure of `db/plants/` and `db/soils/`.

## Files

| File | Sub-category | Items |
|---|---|---|
| `hand-tools.json` | 🪒 Hand Tools (khurpi, sickle, trowel, loppers, grafting knife, …) | 11 |
| `irrigation.json` | 💧 Irrigation (drip kits, sprinklers, soaker hose, self-watering globes) | 6 |
| `containers.json` | 🛍️ Containers (grow bags, trays, vertical planters, raised beds) | 8 |
| `support.json` | 🎍 Support (stakes, cages, trellis, hanging baskets, ties) | 5 |
| `protection.json` | ☂️ Protection (shade net, insect net, mulch sheets, frost cover) | 4 |
| `diagnostics.json` | 📟 Diagnostics (pH/moisture/light meter, TDS, NPK strips, thermometer) | 5 |
| `propagation.json` | 🌱 Propagation (heat mat, mini greenhouse, rooting hormone, grafting tape) | 4 |
| `pest-control.json` | 🪤 Pest-Control hardware (sticky traps, pheromone traps, sprayers) | 5 |
| `safety-gear.json` | 🧤 Safety (gloves, sun hat, knee pads, apron, arm sleeves) | 5 |
| **Total** | **9 sub-categories** | **53** |

## Schema (per item)

```json
{
  "id": 185,
  "cat": "tools",
  "subcat": "hand-tools",
  "name": "Khurpi (Indian Hand Weeder)",
  "desc": "Carbon-steel curved blade — weeds, digs, harvests",
  "how": "Wipe & oil after use.",
  "price": 179,
  "old": 230,
  "region": "All India",
  "tags": ["essential", "indian", "weeding"],
  "emoji": "🪒"
}
```

Required fields: `id`, `cat` (always `"tools"`), `subcat`, `name`, `desc`, `price`, `emoji`.

## Usage

### Node / build-time
```js
const tools = require('./db/tools');
console.log(tools.ALL.length);                 // 53
console.log(tools.getBySubcat('irrigation'));  // [...6 items]
console.log(tools.getById(214));               // 3-in-1 Soil Meter
```

### Browser (already wired)
`shared/gf-app.js` fetches every sub-category JSON on first Shop render and
merges them into `window.GF_PRODUCTS` (de-duped by `id`), so the existing
Shop renderer + cart code works unchanged.

## Adding a new tool

1. Pick the right sub-category file (or add a new one).
2. Use the next free `id` (highest in this DB right now: **229**).
3. Make sure `subcat` matches the file name.
4. Bump the cache version in all five HTML files (`v=20260519…`).
