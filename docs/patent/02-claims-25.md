# 02 · Claims — 25 Layered Claim Set

Standalone copy of the claims for attorney review.
Mirrors §4 of [`01-patent-specification.md`](./01-patent-specification.md).

## Independent claims

### Claim 1 — System

An AI-based ecological optimization system comprising:

- a **spatial allocation engine** configured to divide a constrained area
  into a plurality of crop zones;
- a **plant interaction model** comprising a synergy-and-competition matrix
  scoring pairwise plant interactions;
- a **generative AI module** configured to convert user inputs into
  structured ecological planning data;
- an **organic constraint filter** configured to exclude chemical-dependent
  plants and inputs;

wherein the system is configured to generate, and continuously re-generate,
optimized plant distribution plans in the constrained environment based on
environmental, biological and user-driven changes.

### Claim 2 — Method

A method for adaptive organic garden management comprising:

1. receiving spatial and environmental inputs;
2. normalizing said inputs into feature vectors;
3. computing ecological compatibility scores between candidate plants;
4. generating an optimized multi-zone plant layout under organic-only
   constraints;
5. monitoring deviations in growth, pest, and soil parameters; and
6. updating model parameters and re-generating the plant layout in response
   to said deviations,

thereby producing an adaptive, self-healing organic garden plan.

### Claim 3 — Generative AI

A generative AI system configured to convert natural-language user inputs
describing space, location and household requirements into structured
ecological farming blueprints comprising at least: a zone-level plant
allocation, a companion-planting map, and a rotation schedule.

## Dependent claims

| # | Claim |
|--:|-------|
| 4  | System of Claim 1 wherein the spatial allocation is divided into multi-zone crop distribution including short-cycle, seasonal and perennial zones. |
| 5  | System of Claim 1 wherein the plant interaction matrix comprises synergy, competition and neutral scoring per plant pair. |
| 6  | System of Claim 1 further comprising pest-resistance modelling using plant-pairing influence factors. |
| 7  | System of Claim 1 further comprising a soil-regeneration scheduling module based on per-plant lifecycle analysis. |
| 8  | System of Claim 1 further comprising a real-time environmental adaptation engine. |
| 9  | System of Claim 1 further comprising a water-constraint-based crop-substitution engine. |
| 10 | System of Claim 1 further comprising a sunlight-based plant-relocation module. |
| 11 | System of Claim 1 further comprising a failure-recovery module for germination failure. |
| 12 | System of Claim 1 further comprising a localized replanting module for partial crop loss. |
| 13 | System of Claim 1 further comprising a dynamic pest-outbreak response module. |
| 14 | System of Claim 1 further comprising a biodiversity-optimization engine. |
| 15 | System of Claim 1 wherein the optimization is multi-objective, balancing yield, sustainability and maintenance. |
| 16 | System of Claim 1 further comprising an organic-only enforcement module excluding chemical-dependent inputs. |
| 17 | System of Claim 1 further comprising an edge-case recovery mode for system-wide failure. |
| 18 | System of Claim 1 further comprising a confidence-based AI fallback module. |
| 19 | System of Claim 1 further comprising a low-maintenance mode adaptation module. |
| 20 | System of Claim 1 further comprising a vertical-farming transformation module. |
| 21 | System of Claim 1 further comprising a hydroponic adaptation module. |
| 22 | System of Claim 2 further comprising a continuous feedback-learning loop in which model parameters are updated according to `θ(t+1) = θ(t) + η · error`. |
| 23 | System of Claim 1 further comprising a user-behaviour adaptation engine. |
| 24 | System of Claim 1 further comprising a predictive crop-yield estimation module. |
| 25 | System of Claim 1 further comprising an auto-reallocation engine triggered by ecological stress signals. |

## Drafting notes for the attorney

- **Independent claims kept broad** — narrow only on the first office-action
  rebuttal if needed.
- **Dependent claims layered** so that even if claim 1 is narrowed, claims
  5, 13, 17, 22 and 25 provide independent protective fall-back.
- Recommended **first office-action narrowing**: tie Claim 1's "generates
  optimized plant distribution plans" to "generates, and continuously
  re-generates, multi-zone allocations in response to a feedback signal
  computed from `θ(t+1) = θ(t) + η · error` where `θ` are model
  parameters". This pulls in the math model as the inventive step.
