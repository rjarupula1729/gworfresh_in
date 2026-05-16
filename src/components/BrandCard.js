// BrandCard — single-row gradient banner.
// Mirrors `.brand-card` from growfresh-app.html.
// Used for Flash Deal, Start Your Journey, Smart Tip, etc.
//
// Requires: expo-linear-gradient  (npm i expo-linear-gradient)
//
// <BrandCard
//   gradient={GRADIENTS.harvest}
//   icon="📦"
//   title="Balcony Starter Kit"
//   subtitle="⏰ 40% OFF · ends in 4h"
//   right={<Text>₹349</Text>}      // optional custom right slot
//   chip="Shop →"                  // OR a simple text chip
//   onPress={...}
// />

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RADIUS, SHADOWS, SPACING } from "../utils/theme";

export default function BrandCard({
  gradient,
  icon,
  title,
  subtitle,
  chip,
  right,
  onPress,
  style,
}) {
  const inner = (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <View style={styles.body}>
        {!!title && (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
        {!!subtitle && (
          <Text style={styles.sub} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right
        ? right
        : !!chip && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          )}
    </LinearGradient>
  );

  if (!onPress) return inner;
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      {inner}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
    color: "#fff",
  },
  body: { flex: 1, minWidth: 0 },
  title: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sub: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    opacity: 0.95,
    marginTop: 2,
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginLeft: 8,
  },
  chipText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },
});
