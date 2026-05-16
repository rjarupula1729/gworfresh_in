// ─── GrowFresh Brand Palette ─────────────────────────────
// "living wellness ecosystem" — mirrors growfresh-app.html :root tokens.
// Always import as:  import { COLORS, GRADIENTS } from "../utils/colors";

export const COLORS = {
  // Primary brand green (identity · headers · CTAs · nav)
  green: "#2E7D32",
  greenDeep: "#1B5E20",
  greenMid: "#388E3C",

  // Secondary fresh green (energy · progress · success)
  greenLight: "#66BB6A",
  greenPale: "#E8F5E9",

  // Wellness orange (streaks · notifications · achievements)
  orange: "#FFB74D",
  orangeDeep: "#FB8C00",
  orangePale: "#FFF3E0",

  // Water blue (hydration · AI insights · wellness)
  blue: "#4FC3F7",
  blueDeep: "#0288D1",
  bluePale: "#E1F5FE",

  // Earth brown (soil · compost · eco · farming)
  brown: "#8D6E63",
  brownDeep: "#5D4037",
  brownPale: "#EFEBE9",

  // Calm accents
  yellow: "#FFC107",
  yellowPale: "#FFFDE7",
  teal: "#26A69A",
  tealPale: "#E0F2F1",
  purple: "#7E57C2",
  purplePale: "#EDE7F6",
  red: "#E53935",
  redPale: "#FFEBEE",

  // Surfaces (cream > pure white)
  bg: "#F8F6F1",
  surface: "#FDFCF8",
  white: "#FFFFFF",

  // Text
  text: "#263238",
  muted: "#6B7C6C",
  border: "#E5DFD2",

  // Aliases for backward compatibility
  primary: "#2E7D32",
  light: "#E8F5E9",
  gray: "#6B7C6C",
  lightGray: "#E5DFD2",
};

// ─── Brand gradients (use with expo-linear-gradient) ─────
// e.g.  <LinearGradient colors={GRADIENTS.primary} start={[0,0]} end={[1,1]} />
export const GRADIENTS = {
  primary: ["#1B5E20", "#43A047"],   // growth · journey · saving · CTA
  fresh:   ["#43A047", "#66BB6A"],   // progress · success · secondary green
  harvest: ["#FB8C00", "#FFB74D"],   // deals · streak · urgency
  sky:     ["#0288D1", "#4FC3F7"],   // tip · info · AI · hydration
  sun:     ["#F9A825", "#FFC107"],   // rewards · achievements
  earth:   ["#5D4037", "#8D6E63"],   // soil · compost · eco
};

// Default export keeps old 4-key shape working
export default {
  primary: COLORS.green,
  light:   COLORS.greenPale,
  text:    COLORS.text,
  white:   COLORS.white,
  ...COLORS,
};
