# 🛠️ GrowFresh — `growfresh-app.html` Developer Guide

A single-file HTML/CSS/JS prototype of the GrowFresh consumer app, rendered
inside a fixed-width "phone frame" for design review. This document is the
**developer onramp**: architecture, conventions, every screen, every script
block, and the safe places to add new features.

> File: [`growfresh-app.html`](../growfresh-app.html) · ~5,800 lines
> Last updated: 2026-05-18

---

## 1 · TL;DR

- **Single HTML file** — no build step, open it in any browser.
- **No framework** — vanilla DOM + a handful of `(function(){...})()` IIFEs.
- **State** lives in module-scoped `let`/`var` + `localStorage` for persistence.
- **Routing** is `<div class="screen">` show/hide via `showScreen(name)` and
  the tab map in `switchTab(tab)`.
- **Companion script** for the R&D Lab full prototype:
  [`growfresh-rd.html`](../growfresh-rd.html), embedded via iframe in
  `screen-rdfull`.

### Quick-start dev loop

```bash
# from repo root
open growfresh-app.html        # or just drag into Chrome
# edit the file, ⌘R to reload
```

No npm. No bundler. Hard-refresh (⌘⇧R) when adding CSS or new `<script>`
blocks to dodge cache.

---

## 2 · File layout

```
growfresh-app.html
├── <head>
│   ├── meta + Nunito font preload
│   └── <style>     ~1,100 lines · ALL CSS (no external stylesheet)
├── <body>
│   ├── <div class="phone">     visual phone frame wrapper
│   │   └── <div class="screen" id="screen-X"> × ~32 screens
│   └── modals (.modal-overlay) appended after screens
└── 14 × <script>   ~3,000 lines · feature-grouped IIFEs
```

### Why one big file?
This is a **design/UX prototype**, not production. Keeping it single-file
lets non-engineers preview by double-clicking, and avoids module bundling
during the rapid-iteration phase. When it productionizes, the natural split
is per-screen JS modules + a router; the screen-id contract already enables
that move.

---

## 3 · Core concepts

### 3.1 Screens

Every navigable page is a `<div class="screen" id="screen-NAME">…</div>` with
this skeleton:

```html
<div class="screen" id="screen-shop">
  <div class="page-header">…header / back button / actions…</div>
  <div class="scroll-body">
    <!-- screen content; scrolls inside the phone frame -->
  </div>
  <div class="bottom-nav">…5-tab nav (Home/Shop/Garden/Community/Profile)…</div>
</div>
```

Add a new screen → add this skeleton, then:
1. Add the key to the `switchTab` map (see §3.3).
2. (Optional) add to the search registry in the Home Global Search script.
3. Open it via `showScreen('mynewscreen')` from any onclick.

### 3.2 Routing — `showScreen` + `goBack`

```js
showScreen('shop');           // push screen
showScreen('cart',{fromBack:true});  // no history push
goBack();                     // pops _navHistory; falls back to 'home'
```

Internal: `_navHistory` is a stack of screen ids. `showScreen` triggers
optional per-screen init hooks (e.g. `loadProfileForEdit()`,
`renderFamilyMembers()`, `renderStars()` for kids, lazy iframe-load for
`rdfull`).

### 3.3 Tab map — `switchTab(tab, cat?)`

```js
function switchTab(tab, cat){
  const map = { home:'home', shop:'shop', garden:'garden',
                community:'community', profile:'profile',
                expert:'expert', calendar:'calendar', analyzer:'analyzer',
                subs:'subs', more:'more', rewards:'rewards', learn:'learn',
                soil:'soil', compost:'compost', wellness:'wellness',
                eating:'eating', aicoach:'aicoach', orders:'orders',
                editprofile:'editprofile', familymembers:'familymembers',
                family:'family', cart:'cart', wishlist:'wishlist',
                future:'future', rd:'rd', kids:'kids' };
  showScreen(map[tab]||tab);
}
```

`switchTab('shop','seeds')` is a special form — it switches to shop and then
activates the matching category pill.

> 🔑 **Adding a new screen?** Always register it in this map. Forgetting is
> the #1 cause of "tab button does nothing" bugs.

### 3.4 Sticky-header pattern (Home / Shop / Garden / Community)

These screens keep their search + filters pinned at the top using
`position:sticky;top:0;z-index:30` containers inside `.scroll-body`. Pattern:

```html
<div class="scroll-body">
  <div class="shop-sticky" style="position:sticky;top:0;z-index:30;background:var(--bg);…">
    <!-- filters / cart icon -->
  </div>
  <div class="product-grid">…scrolling content…</div>
</div>
```

Home does it via `.home-header { position:sticky; top:0; z-index:40 }`.

### 3.5 Bottom nav

Repeated literally inside each tabbed screen (Home/Shop/Garden/Community/Profile).
**Not** a single shared component — keep the markup identical when adding
new tabs or it will look misaligned on different screens.

### 3.6 Modals

```html
<div class="modal-overlay" id="add-plant-modal">
  <div class="modal-sheet">
    <div class="modal-handle"></div>
    <div class="modal-title">…</div>
    …content…
    <button class="modal-cancel" onclick="hideAddPlant()">Cancel</button>
  </div>
</div>
```

CSS: `.modal-overlay` is `position:fixed;inset:0;z-index:200;display:none`.
Toggle with `el.classList.add('show')` / `.remove('show')`. Backdrop-tap to
dismiss is **opt-in** per modal — see the Companions modal
(`onclick="if(event.target===this)hideCompanions()"`).

---

## 4 · Design system

### 4.1 CSS custom properties

```css
:root {
  --green:#2E7D32; --green-deep:#1B5E20; --green-pale:#E8F5E9;
  --orange:#F4631E; --orange-pale:#FFE9DD; --orange-deep:#C53A0F;
  --blue-deep:#0277BD;
  --bg:#F8FBF8; --white:#FFFFFF; --text:#1B2A1F; --muted:#637377;
  --border:#E2EAE3;
  --grad-primary: linear-gradient(135deg,var(--green),var(--green-deep));
  --grad-harvest: linear-gradient(135deg,#F4631E,#C53A0F);
  --grad-fresh:   linear-gradient(135deg,#43E97B,#38F9D7);
  --grad-sky:     linear-gradient(135deg,#4FACFE,#00F2FE);
  --radius:14px;
  --shadow-sm:0 2px 8px rgba(20,40,30,0.06);
  --shadow-md:0 6px 20px rgba(20,40,30,0.08);
}
```

Always use the variables — never hardcode brand colors.

### 4.2 Typography

`'Nunito', system-ui, sans-serif` — loaded from Google Fonts.
Default weight ladder used across screens: **600 / 700 / 800 / 900**.
Body copy is usually 12-13 px (the phone frame is narrow).

### 4.3 Common widgets

| Class | Purpose |
|-------|---------|
| `.page-header` | Sticky top bar with back button + title |
| `.scroll-body` | Scrolling content area, fills remaining height |
| `.bottom-nav` | 5-item tab strip at the bottom |
| `.brand-card` | Gradient hero card (icon · body · chip) |
| `.product-card` | Shop product tile |
| `.profile-row` | Row with icon + 2-line text + `›` arrow |
| `.section-hdr` / `.section-title` / `.section-link` | "Title · See all →" pattern |
| `.sec-label` | Tiny uppercase muted section labels |
| `.cat-pill` | Filter chip (shop categories) |
| `.gf-search` | Search box with leading 🔍 + clearable × |
| `.checkout-strip` | Sticky bottom "View Cart →" bar |
| `.modal-overlay` / `.modal-sheet` / `.modal-handle` | Bottom-sheet modal |

### 4.4 Toasts

```js
showToast('🌱 Added to cart!');                     // 2 s default
showToast('✅ Saved!', 3000);                        // custom ms
```

Single global toast element, queues automatically.

---

## 5 · Screen inventory

> All screens live in `growfresh-app.html`. Line numbers drift as the file
> grows; treat them as anchors, not absolutes.

| ID | Tab? | Purpose | Notes |
|----|:----:|---------|-------|
| `screen-splash` | — | First-paint splash | Auto-advances to login |
| `screen-login` | — | Mock OTP login | Just calls `showScreen('home')` |
| `screen-home` | 🏠 | Greeting · WFH · search · journey · flash deal · daily tips | Sticky header pinned (greeting + 🔥 streak + 🌡️ weather + 💰 savings) |
| `screen-shop` | 🛒 | Search · category strip · region · product grid | Sticky filters + tap-card→Companions popup |
| `screen-cart` | — | Cart line items + UPI checkout entry | `cart` is in-memory dict |
| `screen-wishlist` | — | Saved-for-later (❤️) items | localStorage `gf_wishlist_v1` |
| `screen-future` | — | "Plant in upcoming season" save list | localStorage `gf_future_v1` |
| `screen-upi` | — | Mock UPI app picker | Routes to `screen-success` |
| `screen-success` | — | Order placed confirmation | Confetti + GrowPoints award |
| `screen-garden` | 🌿 | My plants list + add-plant + analyzer entry | Plants persisted in localStorage |
| `screen-expert` | — | Expert call booking flow | Date/slot picker in modal |
| `screen-calendar` | — | Plant timeline / seasonal calendar | `renderPlantTimeline()` |
| `screen-analyzer` | — | AI space analyzer mock | Hardcoded 4-row recommendations |
| `screen-subs` | — | Subscriptions (weekly bundles) | Static cards |
| `screen-more` | — | "More tools" grid | Hub for less-used features |
| `screen-wellness` | — | WFH health corner (water · steps · stretch) | Phase-1 wellness; localStorage `gf_wfh_*` |
| `screen-eating` | — | Mindful eating · 8-glass tracker | Sub-module of wellness |
| `screen-learn` | — | Learn & Grow · videos · traditional wisdom · 🎮 Kids Zone | Kids cards launch `screen-kids` |
| `screen-kids` | — | Kids Farming Games hub | 4 mini-games · 🌟 Garden Stars wallet |
| `screen-rd` | — | R&D Lab in-app mini-planner | Zone + bucket curve (see §7.4) |
| `screen-rdfull` | — | R&D full prototype embed | Iframe lazy-loads `growfresh-rd.html` |
| `screen-soil` | — | Soil analysis (mock) | — |
| `screen-rewards` | — | GrowPoints wallet + tier | localStorage `gf_growpoints` |
| `screen-family` | — | Family Garden hub | — |
| `screen-familymembers` | — | Family member roster | — |
| `screen-community` | 👥 | Feed · groups · challenges | — |
| `screen-compost` | — | Compost guide | Static educational |
| `screen-aicoach` | — | AI coach (heuristic mock) | — |
| `screen-profile` | 👤 | Profile + Bonus Features (R&D entry) | Most settings rows live here |
| `screen-editprofile` | — | Edit user form | `loadProfileForEdit()` on enter |
| `screen-orders` | — | Order history | localStorage `gf_orders_v1` |

---

## 6 · State + persistence

### 6.1 In-memory globals (rebuilt each load)

| Var | Type | Used by |
|-----|------|---------|
| `cart` | `{ id: {qty,name,price,emoji} }` | Shop + cart screens |
| `products` | `{ id: {...} }` | Quick lookup by id (rebuilt from `GF_PRODUCTS`) |
| `GF_PRODUCTS` (on `window`) | `[ {id,cat,name,desc,price,old,region,emoji,...} ]` | Source of truth for the shop catalog |
| `_navHistory` | string[] | Back-stack for `goBack()` |
| `analyzerCartItems` | string[] | De-dupe for "Add to cart" from analyzer |

### 6.2 `localStorage` keys

| Key | Shape | Owner |
|-----|-------|-------|
| `gf_profile_v1` | `{name,email,phone,city,…}` | Profile + Edit Profile |
| `gf_garden_v1` | `[ {id,type,emoji,location,planted,…} ]` | Garden screen |
| `gf_wishlist_v1` | number[] of product ids | Wishlist |
| `gf_future_v1` | number[] of product ids | Future plants |
| `gf_orders_v1` | order objects | Orders screen |
| `gf_growpoints` | number | Rewards |
| `gf_wfh_*` | various | Wellness/WFH module |
| `gf_kids_stars_v1` | number | Kids Games wallet |
| `gf_family_v1` | members[] | Family screen |

**Convention:** prefix everything with `gf_` and version with `_v1` so future
migrations are obvious. Wrap reads in try/catch — Safari Private Mode throws.

---

## 7 · Major feature systems

### 7.1 Shop & cart

- **Catalog** is a static JSON dropped into `window.GF_PRODUCTS` (one big
  array literal, ~80 products). To add a product: append to this array.
- **Rendering** is `renderShopProducts()` (in the Shop IIFE near line 5045+).
  Filters: search text + category pill + region select.
- **Card** is generated by `cardHtml(p)` — image, region chip, category
  badge, name, description, price, +/− control slot (`<div id="ctrl-<id>">`).
- **Tap card** → `showCompanions(p.id)` opens the Companions modal (see 7.5).
  Tapping the `+` button is excluded via `event.target.closest('#ctrl-…')`.

#### Cart mutations
```js
addItem(id);              // qty 0 → 1, or 1 → 2, etc.
changeQty(id, delta);     // +/− 1
addAnalyzerToCart(price, name, emoji);  // path used by Analyzer + Companions
```

After any mutation: `renderCtrl(id)` updates the card's quantity widget, and
`updateCartUI()` updates the badges + checkout strip.

### 7.2 Garden tracker

- Plant objects live in `localStorage.gf_garden_v1`.
- Adding a plant: tap "＋ Add Plant" → `showAddPlant()` opens the modal →
  `selectPlantType(...)` picks a preset → `addPlant()` writes to storage and
  re-renders.
- Each plant gets a calculated `growthPct` from days-since-planted / typical
  cycle (driven by the preset days passed in `selectPlantType`).

### 7.3 Wellness / WFH

The "Work From Healthy Home" corner on Home is its own subsystem:

- Pomodoro-style break timer (water · stretch · plant care · eyes)
- Hydration tracker (8 glasses/day)
- All persisted under `gf_wfh_*` keys
- Reads / writes are guarded behind a single `(function(){...})()` IIFE near
  the bottom of the script section

### 7.4 R&D Lab (in-app + iframe)

| Screen | What it does |
|--------|--------------|
| `screen-rd` | Mini-planner inside the app — state + space inputs → zone + bucket allocation + chips |
| `screen-rdfull` | Full prototype: lazy-loads `growfresh-rd.html` into an iframe. Only loads on first visit. |

**Why lazy-load the iframe?** It pulls in another whole HTML page; loading
upfront would slow the splash. The wrap is:

```js
var orig = window.showScreen;
window.showScreen = function(name, opts){
  var r = orig.apply(this, arguments);
  try { if (name === 'rdfull') loadIframe(); } catch(e) {}
  return r;
};
```

Math model + full plant tables: see [`docs/rd/04-mathematical-ecology.md`](rd/04-mathematical-ecology.md).

### 7.5 Companion Plants popup (recent feature)

Triggered by `showCompanions(productId)`. Located near the bottom of the
file in its own `(function(){...})()` IIFE.

Pieces:

| Function / object | Role |
|-------------------|------|
| `COMPANIONS` (const) | Knowledge base — 25 plants × `{role, good[], avoid[]}` |
| `LAYERS` (const) | Permaculture 7-layer taxonomy (canopy, understory, shrub, herb, ground, vine, root, flower) |
| `PLANT_LAYER_RULES` | Regex → layer key, auto-tags every companion by name |
| `layerFor(name)` | Returns the matching `LAYERS[…]` entry |
| `findKey(name)` | Maps a product name to a `COMPANIONS` key |
| `findProductFor(name)` | Maps a companion name back to an in-catalog product (to show +₹ button) |
| `showCompanions(id)` | Renders the modal sheet |
| `hideCompanions()` | Closes it |

**Render order in the modal:**
1. Plant header (emoji + name + ecological role)
2. 🧮 "Why these pairings?" Math-Blueprint card
3. ✅ Plant Together · Self-Sustaining
   - 📐 Layer legend strip (8 chips)
   - One card per good companion: emoji · name · score-chip · layer-chip · reason · 📐 hint · `+₹` button
4. 🛒 "Add all N companions to cart" mega-CTA (if ≥ 2 buyable)
5. ⚠️ Avoid Planting Nearby
6. Footer link to R&D Lab

**Add a new plant** to the knowledge base: drop an entry into `COMPANIONS`
keyed by lowercase keyword, and (if the name doesn't already match)
add a `findKey` branch. Layers auto-detect from `PLANT_LAYER_RULES` regexes
— add a new regex line for any new name you introduce.

### 7.6 Kids Games

Engine lives in the second-to-last `<script>`. Public API:

```js
window.kidsPlay(g);   // g ∈ 'seed' | 'pest' | 'harvest' | 'quiz'
```

State: a single `localStorage` integer `gf_kids_stars_v1`. Each game ends in
a `celebrate(msg, stars)` call that increments the wallet.

To add a 5th game:
1. Write a `gameFoo()` that injects markup into `document.getElementById('kidsStage')`.
2. Add a button in `screen-kids`' game-picker grid.
3. Register `'foo' → gameFoo()` in the `kidsPlay` switch.

### 7.7 Search

Two independent search bars:

- **Home global search** — searches a hardcoded registry of `[ {label, kw[], action} ]` covering products, features, screens. Inline suggestion dropdown.
- **Shop search** — filters the visible product grid in place. No suggestions.

Search registry lives in the home script IIFE; add an entry to expose any
new screen/feature to global search.

### 7.8 Rewards / GrowPoints

Single integer in `gf_growpoints`. Award via `addGrowPoints(n, reason)`.
Spendable on subscriptions / future redemptions (currently mock).

---

## 8 · Script section overview

The 14 `</script>` blocks roughly group by feature. The current top-of-file
to end order is:

1. Core state · `cart`, `products`, render helpers
2. Navigation · `showScreen`, `goBack`, `switchTab`
3. Profile + Family
4. Garden plants
5. Cart + UPI mock + orders
6. Subscriptions + Rewards
7. Calendar + Analyzer
8. Community feed
9. Wellness / WFH
10. AI coach
11. Home global search + tips
12. Shop product renderer + filters
13. R&D Lab mini-planner + iframe lazy-load
14. Kids Games engine
15. Companion Plants engine *(latest)*

When adding a feature, **append a new IIFE-scoped `<script>` block at the
bottom** rather than editing existing ones. Wrap in:

```html
<script>
(function(){
  // private state
  function publicApi(){ … }
  window.publicApi = publicApi;
})();
</script>
```

This keeps each feature self-contained and avoids polluting globals.

---

## 9 · Conventions cheat sheet

✅ **Do**
- Use the existing CSS variables (`--green`, `--grad-primary`, `--radius`).
- Use `position:sticky` for header strips inside `.scroll-body`.
- Wrap new logic in an IIFE script block; expose only what you must.
- Version localStorage keys with `_v1` and prefix `gf_`.
- Guard `localStorage` reads with try/catch.
- Use `showToast` instead of `alert`.

🚫 **Don't**
- Hardcode brand colors — use the CSS variables.
- Add a new screen without registering it in `switchTab`.
- Inline new modal styles — reuse `.modal-overlay` / `.modal-sheet`.
- Use `confirm()` / `prompt()` — they break the phone-frame visual.
- Mutate `GF_PRODUCTS` at runtime — clone first.

---

## 10 · Add a new feature in 7 steps

> Example: adding a hypothetical **"🪴 Pot Picker"** screen accessible from
> Profile.

1. **Add the screen markup** — copy the `<div class="screen" id="…">`
   skeleton with a `page-header`, a `scroll-body`, and a `bottom-nav`.
2. **Register the route** — `potpicker:'potpicker'` in the `switchTab` map.
3. **Wire entry points** — add a `.profile-row` in `screen-profile` with
   `onclick="showScreen('potpicker')"`.
4. **Style** — use existing classes; new visual primitives go in `<style>` at
   the top of the file.
5. **Logic** — append an IIFE `<script>` at the bottom:
   ```js
   <script>(function(){
     function render(){ /* … */ }
     window.openPotPicker = render;
     var prev = window.showScreen;
     window.showScreen = function(n,o){
       var r = prev.apply(this, arguments);
       try { if(n==='potpicker') render(); } catch(e){}
       return r;
     };
   })();</script>
   ```
6. **Persist** with `localStorage.gf_potpicker_v1`.
7. **Surface in global search** — add `{label:'Pot Picker',kw:['pot','planter'],action:()=>showScreen('potpicker')}` to the home search registry.

---

## 11 · Known footguns & gotchas

- **OneDrive sync.** The repo lives in OneDrive — large saves can momentarily
  re-write the file; if a tool says "no errors" but the browser shows stale
  content, hard-refresh (⌘⇧R) and check the file mtime.
- **Bottom-nav z-index.** It's below modals (200) but above sticky headers
  (40). Don't push a modal `z-index` below 100.
- **Iframe in `screen-rdfull`** isn't reset on close. If you change
  `growfresh-rd.html` and switch tabs, the iframe still shows the old DOM
  until full reload.
- **`switchTab('shop', cat)`** has a 30 ms setTimeout to wait for the screen
  to mount before activating the category pill. Don't shorten this.
- **`addAnalyzerToCart(price, name, emoji)`** is the universal "add to cart"
  signature — it dedupes by name, not id. New entry points should call it
  rather than mutating `cart` directly.

---

## 12 · Related docs

- [`rd/README.md`](rd/README.md) — R&D Lab structured reference
- [`rd/04-mathematical-ecology.md`](rd/04-mathematical-ecology.md) — the
  math behind Companion plants + planner
- [`patent/README.md`](patent/README.md) — patent + investor pack
- [`patent/IN_Patent_Specification.html`](patent/IN_Patent_Specification.html)
  — printable IPO Form-2

— Last updated 2026-05-18 · for `growfresh-app.html` ~5,800 lines · Bump
this date when you make material changes.
