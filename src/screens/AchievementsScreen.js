// AchievementsScreen — GrowPoints, badges, streaks, daily challenges.
// Mirrors the rewards/achievements section in the HTML.
import React, { useContext, useMemo } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { AppContext } from "../context/AppContext";
import { COLORS, GRADIENTS } from "../utils/colors";
import { RADIUS, SHADOWS, SPACING, TYPE } from "../utils/theme";

const BADGES = [
  { id: "first_plant",   name: "First Plant",        icon: "leaf",      need: 10,  desc: "Earn 10+ pts" },
  { id: "wellness_week", name: "Wellness Week",      icon: "heart",     need: 50,  desc: "Earn 50+ pts" },
  { id: "green_thumb",   name: "Green Thumb",        icon: "sparkles",  need: 150, desc: "Earn 150+ pts" },
  { id: "balcony_pro",   name: "Balcony Pro",        icon: "sunny",     need: 300, desc: "Earn 300+ pts" },
  { id: "mindful_grow",  name: "Mindful Grower",     icon: "moon",      need: 500, desc: "Earn 500+ pts" },
  { id: "community_hero",name: "Community Hero",     icon: "people",    need: 750, desc: "Earn 750+ pts" },
];

const REWARDS = [
  { id: "r1", cost: 100, label: "5% off seeds",    icon: "pricetag" },
  { id: "r2", cost: 250, label: "Free delivery",   icon: "rocket" },
  { id: "r3", cost: 500, label: "Expert call",     icon: "call" },
  { id: "r4", cost: 1000, label: "Sapling bundle", icon: "gift" },
];

export default function AchievementsScreen({ navigation }) {
  const { growPoints, todayWellness, resetPoints, addPoints } = useContext(AppContext);
  const today = todayWellness();

  const breaksDone = today.breaks.filter(Boolean).length;
  const dailyDone = breaksDone + (today.breathing ? 1 : 0) + (today.hourForYou ? 1 : 0);
  const dailyTotal = 7;
  const dailyPct = Math.round((dailyDone / dailyTotal) * 100);

  const unlocked = useMemo(() => BADGES.filter((b) => growPoints >= b.need), [growPoints]);
  const nextBadge = useMemo(() => BADGES.find((b) => growPoints < b.need), [growPoints]);

  const redeem = (r) => {
    if (growPoints < r.cost) {
      return Alert.alert("Not enough points", "You need " + (r.cost - growPoints) + " more pts.");
    }
    Alert.alert("Redeem " + r.label, "Spend " + r.cost + " GrowPoints?", [
      { text: "Cancel" },
      {
        text: "Redeem",
        onPress: async () => {
          await addPoints(-r.cost);
          Alert.alert("Redeemed", r.label + " unlocked! Check your account for the code.");
        },
      },
    ]);
  };

  const confirmReset = () => {
    Alert.alert("Reset GrowPoints?", "This clears your point balance (badges stay).", [
      { text: "Cancel" },
      { text: "Reset", style: "destructive", onPress: () => resetPoints() },
    ]);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENTS.sun} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={styles.headerTitle}>GrowPoints & Rewards</Text>
          <Text style={styles.headerSub}>{unlocked.length} of {BADGES.length} badges</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 60 }}>
        {/* Points hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>YOUR GROWPOINTS</Text>
          <Text style={styles.heroValue}>{growPoints}</Text>
          {nextBadge ? (
            <Text style={styles.heroNext}>
              Next: {nextBadge.name} in {nextBadge.need - growPoints} pts
            </Text>
          ) : (
            <Text style={styles.heroNext}>All badges unlocked!</Text>
          )}
        </View>

        {/* Daily challenge */}
        <Text style={styles.sectionTitle}>Today's Challenge</Text>
        <TouchableOpacity
          style={styles.challengeCard}
          onPress={() => navigation.navigate("UrbanLivingScreen")}
          activeOpacity={0.85}
        >
          <View style={styles.challengeBar}>
            <View style={[styles.challengeFill, { width: dailyPct + "%" }]} />
          </View>
          <Text style={styles.challengeText}>
            {dailyDone}/{dailyTotal} wellness actions ({dailyPct}%) - tap to continue
          </Text>
        </TouchableOpacity>

        {/* Badges grid */}
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgeGrid}>
          {BADGES.map((b) => {
            const has = growPoints >= b.need;
            return (
              <View
                key={b.id}
                style={[styles.badge, !has && { opacity: 0.5 }]}
              >
                <View style={[styles.badgeIcon, { backgroundColor: has ? COLORS.yellow : COLORS.border }]}>
                  <Ionicons name={b.icon} size={20} color={COLORS.white} />
                </View>
                <Text style={styles.badgeName}>{b.name}</Text>
                <Text style={styles.badgeDesc}>{b.desc}</Text>
                {has && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>UNLOCKED</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Rewards shop */}
        <Text style={styles.sectionTitle}>Redeem Rewards</Text>
        {REWARDS.map((r) => {
          const can = growPoints >= r.cost;
          return (
            <TouchableOpacity
              key={r.id}
              style={styles.rewardRow}
              onPress={() => redeem(r)}
              activeOpacity={0.85}
            >
              <View style={[styles.rewardIcon, { backgroundColor: can ? COLORS.greenPale : COLORS.bg }]}>
                <Ionicons name={r.icon} size={22} color={can ? COLORS.green : COLORS.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rewardLabel}>{r.label}</Text>
                <Text style={styles.rewardCost}>{r.cost} pts</Text>
              </View>
              <View style={[styles.rewardBtn, !can && { backgroundColor: COLORS.bg }]}>
                <Text style={[styles.rewardBtnText, !can && { color: COLORS.muted }]}>
                  {can ? "Redeem" : "Locked"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Footer */}
        <TouchableOpacity style={styles.resetBtn} onPress={confirmReset}>
          <Ionicons name="refresh-outline" size={16} color={COLORS.red} />
          <Text style={styles.resetText}>Reset GrowPoints</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.lg },
  headerTitle: { ...TYPE.title, color: COLORS.white },
  headerSub: { ...TYPE.caption, color: "rgba(255,255,255,0.9)", marginTop: 2 },

  heroCard: { backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: RADIUS.md, alignItems: "center", ...SHADOWS.sm },
  heroLabel: { ...TYPE.micro, color: COLORS.muted, letterSpacing: 1 },
  heroValue: { fontSize: 48, fontWeight: "900", color: COLORS.green, marginVertical: 4 },
  heroNext: { ...TYPE.caption, color: COLORS.muted },

  sectionTitle: { ...TYPE.title, color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm, fontSize: 14 },

  challengeCard: { backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: RADIUS.md, ...SHADOWS.sm },
  challengeBar: { height: 10, backgroundColor: COLORS.greenPale, borderRadius: 5, overflow: "hidden" },
  challengeFill: { height: 10, backgroundColor: COLORS.green },
  challengeText: { ...TYPE.caption, color: COLORS.muted, marginTop: 6 },

  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  badge: { width: "31%", backgroundColor: COLORS.white, padding: SPACING.sm, borderRadius: RADIUS.sm, alignItems: "center", ...SHADOWS.sm },
  badgeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  badgeName: { ...TYPE.caption, color: COLORS.text, textAlign: "center" },
  badgeDesc: { ...TYPE.micro, color: COLORS.muted, marginTop: 2, textAlign: "center" },
  badgePill: { marginTop: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: COLORS.green },
  badgePillText: { fontSize: 8, fontWeight: "900", color: COLORS.white },

  rewardRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.sm, gap: SPACING.md, ...SHADOWS.sm },
  rewardIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rewardLabel: { ...TYPE.card, color: COLORS.text },
  rewardCost: { ...TYPE.caption, color: COLORS.green, marginTop: 2 },
  rewardBtn: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.pill, backgroundColor: COLORS.green },
  rewardBtnText: { color: COLORS.white, fontSize: 11, fontWeight: "900" },

  resetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: SPACING.md, marginTop: SPACING.lg },
  resetText: { ...TYPE.caption, color: COLORS.red },
});
