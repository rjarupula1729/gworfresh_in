# 06 · Global Patent & IP Strategy

A practical, attorney-handoff-ready roadmap for taking the GrowFresh patent
from draft → granted, across India, US, and PCT signatories.

## 1 · Filing roadmap

| Phase | Filing | Timing | Cost band (₹) | Notes |
|------:|--------|--------|--------------:|-------|
| 0 | Internal review of [`01`–`03`](.) | now | — | This folder |
| 1 | **IN Provisional** (priority date) | within 1 month | 1.5 – 3 L | Cheapest way to lock priority |
| 2 | IN Complete specification | within 12 months of provisional | 1 – 2 L | Convert + claims polish |
| 3 | **PCT international application** | within 12 months of priority | 2 – 4 L | One filing → 150+ countries optional |
| 4 | US Utility (national phase) | 30 months from priority | 4 – 8 L | High strategic value |
| 5 | EP / JP / AU national phases | 30 months from priority | varies | Pick by market plan |
| 6 | Examination + Office actions | yr 2 – 4 | ongoing | Reserve buffer ≥ 5 L |
| 7 | Grant | yr 3 – 5 | — | Renew annually |

Total realistic 5-yr legal budget: **₹25 – 40 L** for IN + PCT + US grant.

## 2 · Claim narrowing strategy

| Risk vector | Pre-empt by … |
|-------------|---------------|
| "AI alone is abstract" | Always tie back to *technical effect* — yield (kg), pest reduction (%), soil organic matter (%). |
| "Just a recommender" | Anchor independent claims to **the feedback law `θ(t+1) = θ(t) + η · error`** and the **interaction matrix M(i,j)**. |
| "Prior art exists for crop suggestion" | Emphasize *organic-only constraint*, *self-healing recovery*, and *multi-zone reallocation* — none in prior art. |
| "Lacks hardware" (USPTO) | Include the **IoT embodiment**: soil moisture sensor → feedback → re-optimize. |

**Recommended first office-action fallback claim** (Claim 1 narrowed):

> An AI-based ecological optimization system comprising a spatial allocation
> engine, a plant interaction matrix engine, an organic constraint filter,
> and a feedback module that updates model parameters per
> `θ(t+1) = θ(t) + η · error` based on observed deviations in plant growth,
> pest occurrence, and soil nutrient status; wherein the system
> continuously re-generates a multi-zone plant distribution plan in response
> to said updated parameters.

## 3 · Competitor bypass analysis

How a copycat might try to design around — and what we file to block them.

| Bypass tactic | Likely target | Counter-claim |
|---------------|---------------|---------------|
| Drop the interaction matrix, ship "AI suggestions" | Claim 5 | Strong dependent claim — they can't replicate ecological intelligence without it. |
| Use the math but not the organic filter | Claim 16 | Independent dependent — file as standalone improvement patent. |
| Hardware-first sensor product | Claim 8, 9 | File **improvement patent** on sensor-to-feedback loop early. |
| Hydroponic / vertical pivot | Claims 20–21 | Already covered as dependent claims. |
| "Plant-pair suggestions only" SaaS | Claim 6 | Pest-resistance modelling via pairing — covered. |

## 4 · Trade secrets (kept out of filing)

These are deliberately **not** patented — they remain trade secrets to
preserve competitive edge:

- Exact numeric weights for α, β, γ, δ, λ per user preset
- Calibration constants for HFS (Harvest Frequency Score)
- The curated `ZONES` plant chips per region (curated dataset)
- Community telemetry aggregation rules
- Specific learning-rate `η` schedule

## 5 · Monetization & licensing model

| Channel | Vehicle | Indicative deal |
|---------|---------|-----------------|
| B2C app subscription | EULA + standard ToS | ₹99 – ₹499 / mo |
| B2B API | Per-call + annual minimum | ₹5 – 50 L / yr |
| White-label engine | Field-of-use license | royalty + per-seat |
| Government / smart-city | RFP + per-installation | project-based |
| Patent licensing | Field-of-use license | 3–7 % royalty cap |
| Cross-license (defensive) | With large agritech players | freedom-to-operate |

## 6 · Startup IP protection roadmap

- **Day 0:** assignment agreement signed by all contributors (founders +
  contractors). Treat the repo as a "trade secret" — keep `docs/patent/`
  and `docs/rd/` out of any public mirror until the IN provisional is filed.
- **Pre-filing:** add an `IP_NOTICE.md` at repo root once filing begins.
- **Post-filing:** mark every patent-claim-aligned module in code with a
  `// patent-pending: claim N` comment for evidentiary chain.
- **Hiring:** all employment agreements must include invention-assignment +
  confidentiality clauses, India-enforceable.
- **Open source caution:** any third-party library used in the optimization
  engine should be permissive (MIT / Apache 2). Avoid AGPL.

## 7 · Document handoff checklist (to attorney)

- [ ] [`01-patent-specification.md`](./01-patent-specification.md) — formal text
- [ ] [`02-claims-25.md`](./02-claims-25.md) — claim layering
- [ ] [`03-figures.md`](./03-figures.md) — figure descriptions
- [ ] [`docs/rd/04-mathematical-ecology.md`](../rd/04-mathematical-ecology.md) — math model + Python skeleton
- [ ] Working prototype URL (R&D Lab inside the app) for "reduction to practice"
- [ ] Inventor declaration + ID proof
- [ ] Power of Attorney (Form 26 — IPO)
- [ ] Form 1, 2, 3, 5 (IPO) drafts

## 8 · Timeline (next 90 days)

| Day | Action | Owner |
|----:|--------|-------|
| 0   | Freeze docs in `docs/patent/` | Product |
| 7   | Attorney shortlist + brief | Founders |
| 14  | Engage attorney + share folder | Founders |
| 30  | Provisional draft v1 review | Founders + Attorney |
| 45  | File IN Provisional | Attorney |
| 60  | Public soft-launch of R&D Lab as "patent-pending" | Product |
| 90  | Begin PCT preparation | Attorney |
