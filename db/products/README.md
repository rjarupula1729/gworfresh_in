# 🛒 GrowFresh Products Database

Shop catalog split per-category JSON, mirroring `db/plants/`, `db/soils/`, `db/tools/`.

| File | Category | Items |
|---|---|---|
| `seeds.json` | 🌱 Seeds (region-grouped) | 78 |
| `saplings.json` | 🌿 Saplings (region-grouped) | 74 |
| `minerals.json` | 🪨 Mineral amendments | 6 |
| `compost.json` | 🪱 Compost & busy-mode combos | 18 |
| _(tools)_ | 🛠️ Tools live in `db/tools/` (sub-categorised) | 53 |
| **Total** | | **229** |

## Schema (per item)

```json
{
  "id": 1,
  "cat": "seeds",
  "name": "Tomato Seeds (Desi)",
  "desc": "High-yield desi variety, 50 seeds",
  "how": "Sow 1cm. Daily water. 70-80d.",
  "price": 49,
  "old": 60,
  "region": "Hyderabad",
  "tags": ["popular", "beginner"],
  "emoji": "🍅"
}
```

Optional fields: `subcat`, `unit`.

## Loading

**Node / build-time**
```js
const products = require('./db/products');
console.log(products.ALL.length);             // 229 (incl. tools)
console.log(products.getByCat('compost'));    // 18 items
console.log(products.getByRegion('Mumbai'));  // 12 items
```

**Browser** — `shared/gf-app.js` fetches `db/products/*.json` + `db/tools/*.json`
on first Shop render and assembles `window.GF_PRODUCTS`. Cached in
`localStorage` so subsequent loads are instant.

## Adding a new product

1. Pick the right category file (or create one).
2. Use the next free `id` (highest right now: **184** for products, **229** for tools).
3. Bump cache version in all 5 HTML files (`v=20260519…`).
