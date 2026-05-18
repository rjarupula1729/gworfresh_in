# 02 · Geo-Adaptive Garden Planner

The first concrete R&D module. Maps user inputs → climate zone → space split →
zone-tuned plant chips.

## Inputs (UI form)

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| State | select (Indian states) | Telangana | Primary zone driver |
| City | free text | — | Metro override → `urbanhybrid` |
| Space | number (sq ft) | 120 | Drives the bucket curve |
| Sun | select (full / partial / low) | partial | Future plant filter |
| Water | select (high / medium / low) | medium | Future plant filter |
| Family size | number | 4 | Future yield scaling |

## Ecology zones (6)

| Zone id | Emoji | Label | Short note |
|---------|-------|-------|------------|
| `tropical` | 🌴 | Tropical Humid | Long seasons, dense layering |
| `semiarid` | 🌾 | Semi-Arid | Drought-tolerant, mulch-heavy |
| `desert` | 🏜️ | Desert / Dry Heat | Xeriscape, windbreaks |
| `hill` | 🏔️ | Temperate Hill | Berries, stone fruits |
| `rainforest` | ☔ | High Rainfall | Bamboo, dense canopy |
| `urbanhybrid` | 🏙️ | Urban Hybrid | Container-first, vertical |

## State → zone mapping (current R&D defaults)

| Zone | States |
|------|--------|
| tropical | Kerala, Goa, coastal AP, coastal TN, coastal Karnataka |
| semiarid | **Telangana**, Andhra Pradesh, Maharashtra, Karnataka (interior), Tamil Nadu (interior), Gujarat |
| desert | Rajasthan, Kutch |
| hill | Himachal Pradesh, Uttarakhand, Sikkim, J&K, Arunachal |
| rainforest | Meghalaya, Assam, Mizoram, parts of Western Ghats |
| urbanhybrid | *Any state when city ∈ metro list* |

Metro overrides (force `urbanhybrid`): Hyderabad, Bangalore, Chennai, Mumbai,
Delhi, Pune, Kolkata, Ahmedabad.

## Space allocation curve (5 buckets)

Returns 3-tuple `[daily%, seasonal%, longterm%]` based on total area `A`.

| Bucket name | Range (sq ft) | Daily | Seasonal | Long-term | Rationale |
|-------------|---------------|------:|---------:|----------:|-----------|
| Micro       | < 50          | 70 | 30 | 0  | No room for perennials — focus on greens |
| Small       | 50–149        | 50 | 30 | 20 | Add one fruiting shrub |
| Medium      | 150–499       | 40 | 35 | 25 | True 3-way split |
| Large       | 500–1999      | 30 | 30 | 40 | Tree layer dominates |
| Very Large  | ≥ 2000        | 20 | 30 | 50 | Food-forest mode |

## Plant chips (per zone, per bucket)

Each zone exposes `{ daily: [...], seasonal: [...], longterm: [...] }`,
trimmed to top 6 per bucket. Source of truth: `ZONES` constant in
`growfresh-rd.html`.

Example — **Semi-Arid** (Telangana default):

```js
{
  daily:    [['🥬','Spinach'], ['🌿','Coriander'], ['🍃','Mint'],
             ['🥒','Cucumber'], ['🍅','Cherry tomato'], ['🌶️','Chilli']],
  seasonal: [['🌽','Maize'], ['🥬','Methi'], ['🧄','Garlic'],
             ['🥕','Carrot'], ['🥔','Potato'], ['🍆','Brinjal']],
  longterm: [['🥭','Mango'], ['🍋','Lemon'], ['🌰','Tamarind'],
             ['🌳','Drumstick'], ['🍈','Papaya'], ['🌿','Curry leaf']]
}
```

## Edge cases

- **Space < 50 sq ft** → long-term bucket auto-shows: *"⚠️ Skipped — too little
  space for perennials"* (`b.longterm === 0` guard in render).
- **Unknown state** → falls back to `semiarid` (safest default for India).
- **City typed but not a metro** → ignored, state mapping wins.

## Where this lives in code

- Standalone full prototype: `growfresh-rd.html` (`ZONES`, `STATE_ZONE`,
  `METRO_CITIES`, `BUCKETS`, `bucketFor()`, `render()`)
- In-app mini-planner: `growfresh-app.html` → `screen-rd` + IIFE near `</body>`

## Future enhancements

- Pull live sun + rainfall from a weather API (currently form input)
- Override with on-device geolocation when permission granted
- Per-soil-type variant (red / black / sandy / clay)
