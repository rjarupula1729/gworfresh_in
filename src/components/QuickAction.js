// QuickAction — icon-over-label pill used in the home 5-icon row.
// Mirrors `.home-qa` / `.qa-icon` / `.qa-label` from growfresh-app.html.

import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../utils/colors";
import { RADIUS, SHADOWS } from "../utils/theme";

export default function QuickAction({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.tile}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    marginHorizontal: 3,
    ...SHADOWS.sm,
  },
  icon: { fontSize: 20, lineHeight: 22, marginBottom: 4 },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
});
