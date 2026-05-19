# 🛍️ GrowFresh Shop Config

Single JSON file that controls the Shop page UI — categories, regions,
sub-categories, badges, card gradients, and delivery copy. Loaded once at
page-load by `shared/gf-app.js`, with the inline defaults serving as
offline fallback.

## Why?

Previously the Shop's category pills were hard-coded in `shop.html`, the badge
labels + card gradients were hard-coded in a `bgFor()` / `badge()` function in
JS, and the tools sub-strip was a literal array inside another function. Adding
or renaming a category meant editing **three different files**.

Now: edit **one JSON file**.

## Schema

```jsonc
{
  "categories":   [{ "key", "label", "emoji" }],  // main filter pills
  "subcatsByCat": { "<cat>": [{ "key", "label", "emoji" }] },  // sub-pills
  "regions":      [{ "value", "label" }],         // region dropdown
  "badges":       { "<cat>": "BADGE_TEXT" },      // top-right card badge
  "cardGradients":{ "<cat>": "linear-gradient(...)", "default": "..." },
  "livingCats":   ["seeds", "saplings"],          // cats with 🤝 companions
  "freeDeliveryAbove": 499,                       // ₹
  "deliveryFee":       49,                        // ₹
  "deliveryEta":       "2–4 hrs",
  "deliveryCity":      "Hyderabad"
}
```

## Adding a category

```jsonc
// db/shop-config.json
"categories": [
  ...existing...,
  { "key": "kits", "label": "Garden Kits", "emoji": "📦" }
],
"badges":        { ..., "kits": "KIT" },
"cardGradients": { ..., "kits": "linear-gradient(135deg,#FFF8E1,#FFECB3)" }
```

Then create `db/products/kits.json` with items having `"cat": "kits"`, add
`"kits"` to `_loadProductsDB`'s file list in `gf-app.js`, and bump the cache.

## Adding a region or sub-category

Just edit the relevant array and bump the cache version (`v=20260519…` in the
5 HTML files). No JS or HTML edit needed.

## Runtime flow

1. `_gfLoadShopConfig()` runs in parallel with `_loadProductsDB()` + `_loadToolsDB()`.
2. Once loaded, `_gfRenderShopChrome()` rewrites:
   - the main `.cat-strip` (categories from config)
   - the `#shop-region` `<select>` (regions from config)
   - the `.delivery-note` text (delivery copy from config)
3. `renderShopProducts()` then paints each card via `bgFor()` + `badge()` (both
   read from `GF_SHOP_CONFIG`).
4. When the Tools pill is active, `_gfRenderToolsSubStrip()` builds the sub-pill
   strip from `subcatsByCat.tools`.

Cache key: `localStorage.gf_shop_config_v1`.
