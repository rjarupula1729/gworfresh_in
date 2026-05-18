# 🧪 GrowFresh R&D Lab — Design Reference

This folder is the **single source of truth** for everything that lives behind
the R&D Lab feature in GrowFresh (`Profile → Bonus Features → R&D Lab`).

The R&D Lab in the app is a *living prototype*. These docs are the **formal
specs, math, and rationale** that drive it — kept here so future development
(and any future patent / IP work) has one place to look.

## Contents

| File | What's inside |
|------|---------------|
| [`01-vision.md`](./01-vision.md) | The product vision · why GrowFresh moves beyond "plant suggester" into an AI-powered home food continuity system |
| [`02-geo-adaptive-planner.md`](./02-geo-adaptive-planner.md) | 6 ecology zones · state→zone mapping · 5-tier space allocation curves · plant chips per bucket |
| [`03-continuous-harvest.md`](./03-continuous-harvest.md) | Continuous Harvest Engine · Harvest Frequency Score · Food Security Score · 5-year Future Harvest timeline |
| [`04-mathematical-ecology.md`](./04-mathematical-ecology.md) | 8-stage mathematical pipeline · input vectors · objective function · constraints · feedback loop · patent claim |
| [`05-roadmap.md`](./05-roadmap.md) | Module roadmap · priorities · dependencies |
| [`06-references-inspirations.md`](./06-references-inspirations.md) | Miyawaki · Auroville · Solitude Farm · Pitchandikulam · DDS · Syntropic agroforestry |

## Where this surfaces in the product

```
GrowFresh app (growfresh-app.html)
└── Profile tab
    └── Bonus Features
        └── 🧪 R&D Lab · Garden Planner   [SOON]
            ├── In-app mini-planner (screen-rd)
            │     ├── Conditions form (state + space)
            │     ├── Zone hero · allocation bar · bucket chips
            │     └── Continuous Harvest compact preview
            └── 🔬 Open full R&D prototype →
                  (loads growfresh-rd.html in an in-app iframe)
                  ├── Geo-adaptive planner (full)
                  ├── 7-Layer Food Forest
                  ├── Continuous Harvest Engine
                  ├── Inspirations
                  ├── Roadmap
                  └── 🧮 Mathematical Ecology Blueprint
```

## How to use these docs

- **Building a new R&D module?** Start with `04-mathematical-ecology.md` — every
  module should fit into the 8-stage pipeline (inputs → models → constraints →
  objective → optimization → output → feedback).
- **Adding a new region / plant?** Update `02-geo-adaptive-planner.md` first,
  then mirror in `growfresh-rd.html` (`ZONES`, `STATE_ZONE`, `BUCKETS`).
- **Writing patent / pitch material?** Pull from `04` (claim text) and `03`
  (continuity differentiator).

## File-system map

```
docs/rd/
├── README.md                       ← you are here
├── 01-vision.md
├── 02-geo-adaptive-planner.md
├── 03-continuous-harvest.md
├── 04-mathematical-ecology.md
├── 05-roadmap.md
└── 06-references-inspirations.md
```

— Last updated: 2026-05-18
