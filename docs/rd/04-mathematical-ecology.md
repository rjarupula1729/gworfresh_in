# 04 · Mathematical Ecology Blueprint

The **formal algorithm spec** behind GrowFresh's recommendation engine.
This document is the canonical reference; the R&D Lab UI mirrors it.

## 0 · One-line summary

> A closed-loop, self-adaptive optimization system that allocates garden space
> across plants to maximize household food continuity, ecosystem stability,
> and soil health — subject to climate, family, space, and biology constraints.

---

## 1 · System pipeline (8 stages)

```
START
  │
  ▼
┌──────────────────────────────┐
│ 1. INPUT DATA COLLECTION     │  E⃗ · H⃗ · S⃗ · P⃗
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ 2. NORMALIZATION             │  all inputs → [0,1]
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ 3. ECOLOGICAL INTERACTION    │  M(i,j) · pest · soil · beneficial orgs
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ 4. CONSTRAINTS               │  space · season · soil · water
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ 5. OBJECTIVE FUNCTION        │  maximize F
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ 6. OPTIMIZATION              │  LP · greedy · evolutionary AI
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ 7. ECO-PLANTING LAYOUT       │  zones · companion map · rotation
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ 8. FEEDBACK LOOP             │  ΔY · ΔP · ΔN  →  θ(t+1) = θ(t) + η·error
└──────────────────────────────┘
  │
  └──► REPEAT
```

---

## 2 · Input vectors

| Vector | Symbol | Components |
|--------|:------:|------------|
| Environment | **E⃗** | Weather `W(t)` · Climate `C(region)` · Rain `R(t)` · Season `T(t)` · Geography `G(lat,alt)` |
| Human | **H⃗** | Family size · Consumption `F(i)` · Nutrition needs `N` |
| Space | **S⃗** | Area `A` · Soil type · Sun exposure |
| Plant DB | **P⃗** | Growth rate `Y(i)` · Cycle `T(i)` · Compat matrix `M(i,j)` · Pest resistance `P(i)` |

All inputs are normalized to `[0,1]` before being passed to the interaction
and constraint stages.

---

## 3 · Ecological interaction models

| Model | Formula |
|-------|---------|
| Plant compatibility | `M(i,j) ∈ [-1, +1]` — synergy ↔ antagonism |
| Pest suppression | `S_total = Σᵢ xᵢ · Sᵢ` |
| Soil nutrient cycle | `N(t+1) = N(t) + compost − uptake` |
| Beneficial organisms | `B_total = Σₖ bₖ · impactₖ` |

`xᵢ` = area allocated to plant *i* (decision variable).

---

## 4 · Constraints

```
space:    Σᵢ xᵢ ≤ A
season:   growth_valid(i, T)        # binary feasibility per plant per season
soil:     nutrient_required(i) ≤ soil_capacity
water:    water_need(i) ≤ rainfall + irrigation
```

Additional soft constraints (relaxable via Lagrangian):
- Min daily-harvest plants `≥ K_daily`
- Min long-term tree count `≥ K_trees` (if `A ≥ A_min`)

---

## 5 · Objective function

```
maximize  F = α · H_satisfaction
            + β · Yield
            + γ · Ecosystem_Stability
            + δ · Soil_Health
            − λ · Pest_Risk
```

| Weight | Meaning | Default |
|:------:|---------|--------:|
| α | Family food-need satisfaction | 0.30 |
| β | Total yield (kg/yr) | 0.25 |
| γ | Stability (diversity + resilience) | 0.20 |
| δ | Soil health (organic matter, microbe load) | 0.15 |
| λ | Pest risk penalty | 0.10 |

Weights are **user-tunable presets**:

| Preset | α | β | γ | δ | λ |
|--------|--:|--:|--:|--:|--:|
| "Maximize yield" | 0.20 | 0.45 | 0.10 | 0.15 | 0.10 |
| "Maximize resilience" | 0.20 | 0.15 | 0.35 | 0.20 | 0.10 |
| "Beginner safe" | 0.35 | 0.15 | 0.25 | 0.15 | 0.10 |
| "Regenerative" | 0.20 | 0.15 | 0.20 | 0.35 | 0.10 |

---

## 6 · Optimization engine

Candidate methods (pick per problem size):

| Method | When to use |
|--------|-------------|
| Linear programming | Small (≤ 50 plants), continuous `xᵢ` |
| Greedy selection | Real-time UI (mini-planner) |
| Evolutionary / GA | Medium scale, non-linear objective |
| Constraint solver (OR-Tools) | Discrete + multi-bucket allocation |

**Recommendation:** start with greedy for the in-app mini-planner, and run
LP / GA server-side for the full plan once the user clicks "Generate detailed
plan".

---

## 7 · Output (eco-planting layout)

```
{
  "zones": {
    "daily":     [ { "plant": "spinach", "x_sqft": 12, "rotation": "weekly" }, ... ],
    "seasonal":  [ { "plant": "tomato",  "x_sqft": 18, "season":   "winter" }, ... ],
    "perennial": [ { "plant": "papaya",  "x_sqft": 25, "matures":  "8 mo" }, ... ]
  },
  "companion_map": [ ["banana", "turmeric", "+0.7"], ... ],
  "pest_groups":   [ ["marigold","tomato","chilli"], ... ],
  "rotation_schedule": { "Q1": [...], "Q2": [...], ... }
}
```

---

## 8 · Feedback loop (self-adaptive)

```
ΔY  = expected_yield  − actual_yield
ΔP  = expected_pest   − actual_pest
ΔN  = expected_soil_N − actual_soil_N

error  = w_y·ΔY + w_p·ΔP + w_n·ΔN
θ(t+1) = θ(t) + η · error
```

Where `θ` are the model parameters (weights, compat matrix entries, plant
HFS scores). `η` = learning rate (start at 0.05).

Sources of `actual_*` signals:
- User-logged harvest weight (Garden tab)
- User-reported pest sightings + photos (Analyzer)
- Community telemetry (Geo-Success Validator)
- Optional soil sensor integrations (future hardware)

---

## 9 · Why this matters for the product

✔ **Multi-system integration** — environment + humans + biology in one model
✔ **Mathematical optimization core** — defensible IP, not "tips & tricks"
✔ **Ecological interaction modeling** — companion + pest + soil cycles
✔ **Closed-loop self-adaptive learning** from community data
✔ **Clear patent path:**

> *"Dynamic AI-driven space allocation system for continuous organic
> household food production based on climate, family consumption, growth
> cycles, and perennial yield balancing."*

---

## 10 · Implementation phases

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Static zones · static buckets · curated plant chips | ✅ shipped (R&D Lab v0.1) |
| 1 | Greedy in-app planner with weights preset | ⏳ next |
| 2 | Server-side LP / GA + saved plans per user | ⏳ |
| 3 | Feedback loop wired to harvest log + pest log | ⏳ |
| 4 | Community telemetry → Geo-Success Validator | ⏳ |
| 5 | Soil-sensor integration | 💡 future |

---

## 11 · Python algorithm skeleton (reference)

```python
def recommend_plan(E, H, S, P, weights=None):
    """
    E: dict — environment (weather, climate, rain, season, geo)
    H: dict — human (family_size, consumption, nutrition)
    S: dict — space (area, soil, sun)
    P: list — plant DB (each with growth, cycle, compat row, pest_resist)
    """
    weights = weights or {"alpha":0.30,"beta":0.25,"gamma":0.20,
                          "delta":0.15,"lambda":0.10}

    # 2. normalize
    feats = normalize(E, H, S, P)

    # 3+4. feasible candidates under constraints
    candidates = [p for p in P if feasible(p, S, E)]

    # 5. score each candidate
    def score(p):
        return (weights["alpha"] * satisfaction(p, H)
              + weights["beta"]  * yield_score(p)
              + weights["gamma"] * stability(p, candidates)
              + weights["delta"] * soil_health(p)
              - weights["lambda"] * pest_risk(p))

    # 6. greedy allocate within area A
    plan = greedy_allocate(candidates, area=S["area"], score=score)

    # 7. shape output
    return layout(plan)
```

Full implementation lives outside this repo (planned as `backend/services/eco_planner/`).
