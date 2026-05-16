// ─── GrowFresh Design Tokens ─────────────────────────────
// Spacing, radius, shadows, typography — mirrors growfresh-app.html.

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 18,
  xxl: 22,
};

export const RADIUS = {
  xs: 8,
  sm: 10,
  md: 14,
  pill: 999,
};

// React Native shadow helpers
// Use:  ...SHADOWS.sm  inside a StyleSheet.create entry
export const SHADOWS = {
  sm: {
    shadowColor: "#263238",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  md: {
    shadowColor: "#263238",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 22,
    elevation: 5,
  },
  bandSm: {
    shadowColor: "#1B5E20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
};

export const TYPE = {
  family: "System",                       // swap for "Nunito" once font is loaded
  hero:    { fontSize: 22, fontWeight: "900" },
  title:   { fontSize: 16, fontWeight: "900" },
  card:    { fontSize: 14, fontWeight: "900" },
  body:    { fontSize: 13, fontWeight: "700" },
  caption: { fontSize: 11, fontWeight: "800" },
  micro:   { fontSize:  9, fontWeight: "800" },
};
