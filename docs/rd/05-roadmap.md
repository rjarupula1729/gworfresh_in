# 05 · Roadmap

Modules planned for the R&D Lab, in rough priority order. Each links back to
the [Mathematical Ecology Blueprint](./04-mathematical-ecology.md) stages it
implements.

## Status legend

- ✅ shipped (v0.1 R&D preview)
- ⏳ next up
- 💡 future / research

## Module list

| # | Module | Pipeline stages | Status |
|---|--------|-----------------|--------|
| 1 | Geo-Adaptive Planner (zones + buckets + chips) | 1–2, 7 | ✅ |
| 2 | Continuous Harvest Engine | 5 (β term), 7 | ✅ preview · ⏳ live |
| 3 | 7-Layer Food Forest reference | 7 | ✅ reference content |
| 4 | Mathematical Ecology Blueprint (this doc) | 1–8 | ✅ spec |
| 5 | Family Nutrition Mapping | 1 (H⃗), 5 (α term) | ⏳ |
| 6 | Food Forest Simulator (canopy/years slider) | 7 | ⏳ |
| 7 | Plant Lifetime ROI Calculator | 5 (β term) | ⏳ |
| 8 | Resilient Garden mode (drought / disease / season-spread) | 4, 5 (γ term) | ⏳ |
| 9 | Geo-Success Validator (community telemetry) | 8 | ⏳ |
| 10 | Health-Goal Engine (immunity · diabetes · stress) | 1 (H⃗), 5 (α term) | ⏳ |
| 11 | Sustainability Score (O₂ · heat · water · food) | 5 (γ + δ) | ⏳ |
| 12 | Companion Planting AI (root · sun · nutrient) | 3 (M(i,j)) | ⏳ |
| 13 | Seasonal Rotation Engine (auto-rotate quarterly) | 7 | ⏳ |
| 14 | Soil-sensor integration | 8 | 💡 |
| 15 | Provisional patent filing | — | 💡 |

## Suggested build order (next 3 sprints)

**Sprint 1 — make the planner real**
- Module 5 (Family Nutrition Mapping) — easy win, drives the α weight
- Module 7 (Plant Lifetime ROI) — emotional hook, drives engagement
- Module 12 (Companion Planting AI) — populates `M(i,j)` for the math model

**Sprint 2 — make it adaptive**
- Module 8 (Resilient Garden mode) — adds the γ-weighted preset
- Module 9 (Geo-Success Validator) — first telemetry pipeline
- Module 13 (Seasonal Rotation Engine)

**Sprint 3 — make it visual**
- Module 6 (Food Forest Simulator)
- Module 11 (Sustainability Score) — public-facing badge
- Module 10 (Health-Goal Engine)

## Dependencies

- Modules 5, 10 depend on a **user nutrition profile** (extend the existing
  Edit Profile screen).
- Module 8 depends on **historical rainfall + drought data** — start with
  static tables per state, upgrade to a real API later.
- Module 9 depends on **community telemetry** — needs at least the wellness
  backend pattern extended to plan-outcome reporting.
