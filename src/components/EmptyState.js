import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GRADIENTS } from "../utils/colors";
import { SPACING, RADIUS, SHADOWS, TYPE } from "../utils/theme";

/**
 * Friendly empty state block.
 * Props: icon (emoji), title, subtitle, ctaLabel, onCtaPress
 */
export default function EmptyState({ icon = "🌱", title, subtitle, ctaLabel, onCtaPress }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      {ctaLabel ? (
        <TouchableOpacity onPress={onCtaPress} activeOpacity={0.85} style={{ marginTop: SPACING.lg }}>
          <LinearGradient
            colors={GRADIENTS.fresh}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: COLORS.greenPale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  icon: { fontSize: 48 },
  title: {
    ...TYPE.title,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 6,
  },
  sub: {
    ...TYPE.body,
    color: COLORS.muted,
    textAlign: "center",
  },
  cta: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.pill,
  },
  ctaText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.4,
  },
});
