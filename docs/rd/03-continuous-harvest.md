# 03 · Continuous Harvest Engine

The differentiator. Moves the app from *"what to plant"* → *"how to keep food
coming every week of the year."*

## Core idea

Most plants fail people not because they don't grow, but because they all
**harvest at once and then nothing happens for months**. We solve this by
blending three harvest cadences in every plan:

| Bucket | Cadence | Examples |
|--------|---------|----------|
| **Daily-rotation** | Pick every 1–4 weeks, re-sow | Spinach, methi, coriander, mint |
| **Seasonal fruiting** | One major flush per season | Tomato, brinjal, cauliflower |
| **Perennial / long-term** | Year-round once mature, or annual cycle | Banana, papaya, mango, tamarind |

Allocation across the three buckets comes from the
[Geo-Adaptive Planner](./02-geo-adaptive-planner.md) bucket curve.

## Harvest Frequency Score (HFS)

Single 0–100 score per plant capturing **how often it gives food**.

| Plant | Cadence | HFS | Colour |
|-------|---------|----:|--------|
| Spinach / Methi | Every 25–30 days · re-sow | 95 | green |
| Chilli | Continuous · 6+ months | 90 | red |
| Banana | Year-round once mature | 92 | orange |
| Papaya | Year-round · 2–3 yr cycle | 88 | yellow |
| Dragon Fruit | Multiple flushes · Jun–Nov | 75 | purple |
| Mango | Seasonal · Apr–Jun yearly | 60 | deep-orange |
| Tamarind | Multi-season · decadal yield | 55 | brown |

> **Formula (v0.1):**
> `HFS = 100 × (harvest_weeks_per_year / 52)`
> with bonuses for *continuous* / *multi-flush* and penalty for *single short
> window*.

## Food Security Score (FSS)

A composite score telling the family **how much of their annual food they're
producing themselves**.

| Metric | Definition | MVP default |
|--------|------------|------------:|
| `annual_fruit_pct` | (yield_kg / family_fruit_demand_kg) × 100 | 18% |
| `self_suff_days` | days/year garden alone could sustain fruit demand | ~66 |
| `nutrient_diversity` | unique nutrient classes covered (1–10) | 7 |
| `climate_resilience` | letter grade A–D based on drought + disease + season-spread | B+ |

## Future Harvest Timeline (5-year view)

The "emotional hook" — shows people the long-term payoff.

| Year | Outcome | Plants |
|------|---------|--------|
| 3 months | Leafy vegetables, herbs | Spinach · Methi · Coriander · Mint |
| 8 months | First papaya fruit set | Papaya · Chilli · Tomato |
| 1.5 years | Banana cycle begins | Banana · Drumstick · Curry leaf |
| 3 years | First mango yield | Mango · Guava · Pomegranate |
| 5 years | Tamarind & food-forest stability | Tamarind · Jackfruit · Coconut |

UI: vertical timeline today, **horizontal slider with canopy simulation**
planned (see roadmap).

## Where this surfaces in the product

- **Full prototype** (`growfresh-rd.html`): full HFS table + 2×2 FSS grid +
  5-row timeline + commentary
- **In-app mini-planner** (`screen-rd`): compact 2×2 FSS grid + 5-row timeline
- **Roadmap** in both screens

## Future enhancements

- Per-family `family_fruit_demand_kg` based on family size + nutrition needs
- Per-plant `yield_kg/year` from real grower telemetry
- Nutrition-class mapping (vitamin A · C · iron · protein · fiber · …)
- Climate-resilience auto-grade from local rainfall + drought history
