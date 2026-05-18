# 05 · VC Design Blueprint v6

Slide-by-slide **visual / layout / chart** instructions so the next PPTX
generation pass can produce a true VC-grade deck in one shot — no retry loop.

**Inputs to merge:** [`04-investor-deck-v5.md`](./04-investor-deck-v5.md)
(content) + this file (design).

## Global design system

| Token | Value |
|-------|-------|
| Primary green | `#2E7D32` |
| Deep green | `#1B5E20` |
| Accent teal | `#00897B` |
| Warm orange (yield) | `#F57C00` |
| Earth brown (soil) | `#5D4037` |
| Ink | `#1B2A1F` |
| Muted | `#637377` |
| Background | `#F4F8F5` |
| Title font | **Nunito 900 / 48 pt** |
| Body font | Nunito 700 / 18 pt |
| Slide ratio | 16 : 9 (1920 × 1080) |
| Master bg | white + faint topographic leaf pattern at 4 % opacity |
| Footer | `growfresh.in · confidential · 2026` · slide # |

## Iconography

- Use **solid duotone** icons (Lucide / Tabler style), green + brown.
- Every "engine" gets a consistent geometric badge (rounded square, 80 × 80,
  green fill, white icon).

## Diagram conventions

- All flow diagrams use the same arrow style: 4 px, rounded ends, primary
  green.
- All matrices / heat-maps use a **white → green → orange** divergent scale.

---

## Slide-by-slide blueprint

### S1 · Title

- Layout: full-bleed photograph of a multi-layer urban terrace garden
  (left 60 %); right 40 % white panel with title + tagline.
- Logo top-left, big sub-tagline below title in muted ink.
- Single CTA pill bottom-right: "Series-Seed · 2026".

### S2 · Problem

- Layout: 4 large numeric stat tiles in a 2 × 2 grid + one supporting visual.
  - **70 %+** urban households · no food-growing system
  - **80 %** apps stop at "static list"
  - **0** known systems with self-healing logic
  - **₹38 K Cr** Indian organic food market (2025)
- Pull quote bottom: *"Existing apps stop where the problem begins."*

### S3 · Solution

- Layout: centered **"AI Operating System for Plant Life"** big-text hero.
- Five horizontal pills below, each one a sentence:
  real-time placement · self-healing · interaction intelligence ·
  organic-only · adaptive.
- Right rail: 30-sec video QR linking to the in-app R&D Lab.

### S4 · Core Technology — 5 Engines

- Layout: 5 columns, each with a badge icon + name + 1-line description.
- Engines colored:
  1 Spatial — green · 2 Interaction — teal · 3 Generative — purple ·
  4 Optimization — orange · 5 Self-Healing — red.
- Footer ribbon: "All 5 engines are protected under Patent Claim 1."

### S5 · Why we are different

- Layout: comparison table from `04` slide 5, BUT styled as a horizontal
  matrix with check / cross icons + colored row backgrounds.
- Right callout: "Only GrowFresh ticks all 5."

### S6 · Product Overview

- Layout: phone mock-up on left (real screenshots from `growfresh-app.html`
  → R&D Lab screen with allocation bar visible).
- Right: numbered 4-step user flow + small map of `output` JSON.
- Caption: "Working prototype shipping today."

### S7 · Patent Protection (IP moat)

- Layout: world map (light gray) with India highlighted in deep green and
  US + EU + JP + AU pinned with "PCT planned" markers.
- Below: 4 protection-area cards (Optimization engine · Interaction matrix ·
  Spatial allocation · Self-healing).

### S8 · Competitive Moat

- Layout: 4-quadrant XY chart — X axis: "Static ↔ Adaptive", Y axis:
  "Single-feature ↔ Multi-system". Plot competitors in lower-left, GrowFresh
  alone in upper-right with a glow.

### S9 · Market Opportunity

- Layout: 3 stacked bar charts (Global AgriTech, India Urban Farming,
  Organic food) showing 5-yr CAGR.
- Target-segment ring on right.

### S10 · Business Model

- Layout: 4 large "channel cards" arranged 2 × 2, each with a stylized
  icon, headline, price range, and 1-line growth driver.
- Color coding: B2C green · B2B teal · Gov orange · WhiteLabel purple.

### S11 · Revenue Projection

- Layout: **single hero column chart** Y1–Y5 revenue with a secondary line
  for user count.
- Annotation: "B2B kicks in Y3 — 60 % of Y5 revenue."

### S12 · Technology Stack

- Layout: layered diagram — bottom to top: Data → ML models → Generative AI
  → API → Mobile app → IoT layer (optional, dashed).
- Right: 6 tech logos (Python · Node · PyTorch · OR-Tools · React Native ·
  PostgreSQL).

### S13 · IP Strategy

- Layout: 3-tier pyramid: bottom (widest) "Trade secrets — scoring weights",
  middle "Improvement patents", top "Core patent".
- Right: timeline strip with filing milestones (Q3 2026 IN provisional →
  Q1 2027 PCT → Q3 2027 US utility).

### S14 · Risks & Mitigation

- Layout: 3 horizontal cards, each split: left side risk (red border),
  right side mitigation (green border).

### S15 · Why Now?

- Layout: 4 small line charts (AI adoption · urban farming · organic demand
  · smart-city budgets) — all trending up sharply.

### S16 · Vision

- Layout: full-bleed photograph of a sunset balcony food forest with the
  vision quote overlay, big.

### S17 · Investment Ask

- Layout: large ₹ amount in the center · stage chip · 4 "use of funds"
  segments in a donut chart on the right.

### S18 · Final one-liner / Thank you

- Layout: black background, single white sentence (the final one-liner),
  contact email + LinkedIn + QR.

---

## Asset checklist (to gather before generating PPTX)

- [ ] Hero garden photos (3 — title, vision, problem)
- [ ] Phone mock-up frames (R&D Lab · WFH · Shop)
- [ ] Inkscape SVG for FIG.1–FIG.3 (architecture, zones, matrix)
- [ ] World map base (svg)
- [ ] Logo files (PNG + SVG, full + monogram)
- [ ] Founder portrait + 1-line bio for credits slide
- [ ] Final revenue numbers signed off (replace illustrative table in `04`)

## Generation instructions (for the PPTX tool when retried)

```
SOURCE = docs/patent/04-investor-deck-v5.md   (content master)
DESIGN = docs/patent/05-vc-design-blueprint-v6.md   (this file)
THEME  = green / earth · Nunito · 16:9
OUTPUT = GrowFresh_Investor_Deck_v6.pptx
RULES:
  - One concept per slide
  - No slide > 30 words of body text
  - Every quantitative claim has a source footnote
  - All icons unified style (Lucide solid duotone)
  - Charts use the divergent green→orange scale
```
