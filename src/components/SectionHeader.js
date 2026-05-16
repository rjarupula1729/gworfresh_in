// SectionHeader — bold section title + optional right link.
// Mirrors `.section-hdr` / `.section-title` from growfresh-app.html.

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../utils/colors";

export default function SectionHeader({ title, linkLabel, onLinkPress }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {!!linkLabel && (
        <TouchableOpacity onPress={onLinkPress} hitSlop={8}>
          <Text style={styles.link}>{linkLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.text,
  },
  link: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.green,
  },
});
