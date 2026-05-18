# 03 · Figures — FIG.1 to FIG.10

Each figure is described in enough detail for a patent draftsperson to
produce the formal black-and-white line-art diagram required by IPO / USPTO.
ASCII sketches included as layout guidance only.

---

## FIG.1 — System Architecture Overview

Full pipeline view: how data flows from a user into the AI engine, through
optimization, and back as a self-updating garden plan.

```
 ┌──────────┐    ┌────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
 │  USER    │──▶ │  AI ENGINE │──▶ │  PLANT DB   │──▶ │ OPTIMIZATION   │──▶ │ OUTPUT PLAN  │
 │ (inputs) │    │ (NLP+intent│    │  +  ECO     │    │   ENGINE        │    │ zones · map  │
 └──────────┘    │  +scoring) │    │  KNOWLEDGE   │    │ (LP / greedy / │    │ rotation     │
       ▲         └────────────┘    └──────────────┘    │  evolutionary) │    └──────┬───────┘
       │                                                └────────────────┘           │
       │                                                                             ▼
       └──────────────────── FEEDBACK LOOP ◀────── monitor ΔY · ΔP · ΔN ◀────────────┘
```

Labels: 100 User, 110 AI Engine, 120 Plant DB, 130 Optimization Engine,
140 Output Plan, 150 Feedback.

---

## FIG.2 — Spatial Allocation Engine

Constrained area `A` divided into three zones.

```
┌──────────────────────────────────────────┐
│           CONSTRAINED AREA  A           │
│ ┌────────────────┐  ┌────────────────┐   │
│ │   ZONE A       │  │   ZONE B       │   │
│ │ short-cycle    │  │ seasonal crops │   │
│ │ leafy / herbs  │  │ tomato / chilli│   │
│ └────────────────┘  └────────────────┘   │
│        ┌──────────────────────────┐      │
│        │       ZONE C             │      │
│        │ perennial / trees        │      │
│        │ mango · papaya · banana  │      │
│        └──────────────────────────┘      │
└──────────────────────────────────────────┘
```

Labels: 200 Area A, 210 Zone A (short-cycle), 220 Zone B (seasonal),
230 Zone C (perennial).

---

## FIG.3 — Plant Interaction Matrix

Square `n × n` heat-matrix showing pairwise scores.

```
            P1    P2    P3    P4    P5
        ┌───────────────────────────────┐
   P1   │  —   +0.6  -0.4   0   +0.2  │
   P2   │ +0.6  —    0   +0.8  -0.3  │
   P3   │ -0.4  0    —   +0.5   0    │
   P4   │  0  +0.8 +0.5  —    -0.7  │
   P5   │ +0.2 -0.3  0  -0.7   —    │
        └───────────────────────────────┘
              + synergy  · 0 neutral  · − competition
```

Labels: 300 Matrix M(i,j), 310 Synergy cell, 320 Competition cell,
330 Neutral cell.

---

## FIG.4 — Ecological Scoring Engine

Three sub-scorers feed a weighted aggregator.

```
 ┌───────────────────┐  ┌─────────────────┐  ┌────────────────────┐
 │ Growth compat     │  │ Pest resistance │  │ Nutrient interaction│
 └────────┬──────────┘  └─────────┬───────┘  └──────────┬─────────┘
          │                       │                     │
          └────────────┬──────────┴────────────┬────────┘
                       ▼                       ▼
                ┌──────────────────────────────────┐
                │  Weighted aggregator             │
                │  Score(i) = w1·G + w2·P + w3·N  │
                └──────────────────────────────────┘
```

Labels: 410 Growth, 420 Pest, 430 Nutrient, 440 Aggregator.

---

## FIG.5 — Rotation Scheduler

Cyclic timeline.

```
   Harvest ──▶  Soil recovery (compost, fallow)  ──▶  Replant  ──▶  Harvest …
      ▲                                                                 │
      └─────────────────────────────────────────────────────────────────┘
```

Labels: 500 Harvest, 510 Soil recovery, 520 Replant, 530 Cycle loop.

---

## FIG.6 — Organic Constraint System

Two-input filter.

```
 ALL CANDIDATE PLANTS
        │
        ▼
 ┌──────────────────────────┐
 │ Organic Constraint Filter │
 │ (chem-dependent ❌ /     │
 │  organic-compatible ✅)   │
 └──────────────┬───────────┘
                ▼
    Allowed plant set → Optimization
```

Labels: 600 Candidates, 610 Filter, 620 Allowed set.

---

## FIG.7 — Generative AI Pipeline

```
 User prompt  →  NLP / intent  →  Structured JSON  →  Garden plan
   "balcony       extract:           {state,space,           layout +
    in Hyd,       state, sq-ft,      sun, water,            companion +
    family 4"     family, sun        family}                 rotation
```

Labels: 700 Prompt, 710 NLP, 720 JSON, 730 Plan.

---

## FIG.8 — Edge Case Handling System

```
                ┌──────────────────────────────┐
                │ Edge Case Recovery Engine    │
                ├──────────────────────────────┤
 plant failure ─▶│ • germination-failure recov  │
 pest outbreak ─▶│ • pest-outbreak response     │─▶  partial replan
 water shortage─▶│ • water-substitution         │
                └──────────────────────────────┘
```

Labels: 800 Engine, 810 plant-failure, 820 pest, 830 water.

---

## FIG.9 — Environmental Adaptation Layer

```
 ┌────────────┐ ┌──────────┐ ┌──────────────┐
 │ sunlight Δ │ │ rain Δ   │ │ temperature Δ │
 └─────┬──────┘ └────┬─────┘ └──────┬───────┘
       └──────┬──────┴───────────────┘
              ▼
   ┌─────────────────────────────┐
   │ Environmental Adaptation     │
   │ Layer → re-tune α,β,γ,δ,λ    │
   └────────────┬────────────────┘
                ▼
         Re-optimization
```

Labels: 900 Sun, 910 Rain, 920 Temp, 930 Adaptation layer.

---

## FIG.10 — System Recovery Mode

Zone-level reset.

```
 detected: system-wide stress
        │
        ▼
 ┌─────────────────────────────────┐
 │ Zone Reset Sequence              │
 │ 1. freeze planting               │
 │ 2. compost top-up                │
 │ 3. recompute layout (greedy)     │
 │ 4. partial-rebuild only stressed │
 │    zones; preserve healthy ones  │
 └─────────────────────────────────┘
        │
        ▼
   Resume normal operation
```

Labels: 1000 Trigger, 1010 Reset sequence, 1020 Resume.
