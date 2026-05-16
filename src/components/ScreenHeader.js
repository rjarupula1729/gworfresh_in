// ScreenHeader — green gradient header with back button + title.
// Mirrors `.page-header` from growfresh-app.html.
//
// <ScreenHeader title="Order Tracking" onBack={() => navigation.goBack()} />

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../utils/colors";

export default function ScreenHeader({ title, onBack, right }) {
  return (
    <LinearGradient
      colors={GRADIENTS.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrap}
    >
      <StatusBar barStyle="light-content" />
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back} hitSlop={10}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.back} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: Platform.OS === "ios" ? 50 : 28,
    paddingBottom: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 22,
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },
  right: { width: 34, alignItems: "flex-end" },
});
