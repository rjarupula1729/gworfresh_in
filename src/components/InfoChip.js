import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, GRADIENTS } from "../utils/colors";
import { SPACING, RADIUS } from "../utils/theme";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Small colored pill. Variants: green | orange | blue | brown | sun | neutral
 * Or pass a custom gradient array via `gradient` prop.
 */
export default function InfoChip({ label, variant = "green", gradient, icon, style }) {
  const grad = gradient || mapVariant(variant);
  return (
    <LinearGradient
      colors={grad}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.chip, style]}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </LinearGradient>
  );
}

function mapVariant(v) {
  switch (v) {
    case "orange":
      return GRADIENTS.harvest;
    case "blue":
      return GRADIENTS.sky;
    case "brown":
      return GRADIENTS.earth;
    case "sun":
      return GRADIENTS.sun;
    case "neutral":
      return [COLORS.muted, COLORS.muted];
    case "green":
    default:
      return GRADIENTS.fresh;
  }
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  icon: { fontSize: 11, marginRight: 4, color: COLORS.white },
  text: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
