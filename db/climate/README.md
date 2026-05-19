# 🌍 GrowFresh Climate DB

Climate zones + state→zone mapping + space-size buckets — extracted from the
inline IIFE in `shared/gf-app.js` (Regional Designer mini-tool) so they can be
edited / extended without touching code.

| File | Contents |
|---|---|
| `zones.json` | 6 climate zones (tropical / semi-arid / desert / hill / rainforest / urban-hybrid) — each with emoji, name, summary, traits |
| `state-zone-map.json` | 33 Indian states + UTs → climate zone |
| `rd-buckets.json` | 5 space-size buckets (Micro / Small / Medium / Large / Very-large) → suggested distribution of decorative %, sapling %, layered % |

## Usage

```js
const climate = require('./db/climate');
climate.zoneForState('Telangana');   // → 'semiarid'
climate.zoneInfo('hill');            // → {e:'🏔️', n:'Temperate Hill', ...}
climate.bucketFor(420);              // → {max:500, name:'Medium', d:40, s:35, l:25}
```

In the browser, `shared/gf-app.js` loads these files lazily when the Regional
Designer screen activates, falls back to inline defaults if `fetch` fails.

## Adding a state or zone

1. Add the state to `state-zone-map.json` with one of the 6 zone keys.
2. To add a new zone: add an entry to `zones.json` with `{e, n, s, t}`.
3. No JS change needed. Cache-bust by bumping `v=20260519…` in the HTML pages.
