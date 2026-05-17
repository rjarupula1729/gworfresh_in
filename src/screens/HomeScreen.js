// HomeScreen — dashboard with live clock, dynamic greeting, quick actions,
// urban-living strip, region picks, and a daily tip.
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import API from "../services/api";
import { AppContext } from "../context/AppContext";
import { COLORS, GRADIENTS } from "../utils/colors";
import { RADIUS, SHADOWS, SPACING, TYPE } from "../utils/theme";

const TIPS = [
  "Water plants early morning to reduce evaporation.",
  "Pinch off the tops of basil to encourage bushier growth.",
  "Rotate pots weekly so all sides get equal sunlight.",
  "Add compost monthly for richer, more fertile soil.",
  "Mulch holds moisture and keeps roots cool.",
  "Group plants with similar water needs together.",
  "Use rainwater when possible - your plants will love it.",
];

const URBAN_CARDS = [
  { icon: "leaf",         title: "5-Min Stress Reset", sub: "Box-breathing",    tint: COLORS.purplePale, color: COLORS.purple },
  { icon: "laptop",       title: "Mid-Meeting Break",  sub: "Stretch + sip",    tint: COLORS.bluePale,   color: COLORS.blueDeep },
  { icon: "sunny",        title: "Balcony Boost",      sub: "10-min care",      tint: COLORS.greenPale,  color: COLORS.green },
  { icon: "people",       title: "Family Time",        sub: "Garden together",  tint: COLORS.orangePale, color: COLORS.orangeDeep },
  { icon: "trophy",       title: "Daily Challenge",    sub: "Earn points",      tint: COLORS.yellowPale, color: COLORS.yellow },
];

const QUICK_ACTIONS = [
  { key: "Shop",      icon: "storefront",     label: "Shop",      color: COLORS.green },
  { key: "Garden",    icon: "leaf",           label: "Garden",    color: COLORS.greenLight },
  { key: "Community", icon: "chatbubbles",    label: "Community", color: COLORS.blue },
  { key: "Profile",   icon: "person-circle",  label: "Profile",   color: COLORS.orange },
];

function nowClock() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + m.toString().padStart(2, "0") + " " + ampm;
}

function greetingFor(hour) {
  if (hour < 5) return "Sleep tight";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AppContext);

  const [clock, setClock] = useState(nowClock());
  const [picks, setPicks] = useState([]);
  const [loadingPicks, setLoadingPicks] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = useMemo(() => {
    const n = (user?.name || "").trim().split(/\s+/)[0];
    return n || "Friend";
  }, [user?.name]);

  const city = user?.city || "Hyderabad";
  const greeting = greetingFor(new Date().getHours());
  const tip = useMemo(() => TIPS[new Date().getDay() % TIPS.length], []);

  useEffect(() => {
    let intervalId;
    const update = () => setClock(nowClock());
    const msToNextMin = 60000 - (Date.now() % 60000);
    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60000);
    }, msToNextMin);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const loadPicks = useCallback(async () => {
    try {
      const res = await API.get("/products", { params: { region: city } });
      const list = Array.isArray(res.data) ? res.data : [];
      setPicks(list.slice(0, 6));
    } catch {
      setPicks([]);
    } finally {
      setLoadingPicks(false);
      setRefreshing(false);
    }
  }, [city]);

  useEffect(() => { loadPicks(); }, [loadPicks]);

  const goTab = (tab) => navigation.navigate("Main", { screen: tab });

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); loadPicks(); }}
        />
      }
    >
      <LinearGradient colors={GRADIENTS.primary} style={styles.band}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{firstName}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.85)" />
            <Text style={styles.metaText}>{clock}</Text>
            <Text style={styles.metaDot}>-</Text>
            <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.85)" />
            <Text style={styles.metaText}>{city}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bell} onPress={() => goTab("Community")} hitSlop={6}>
          <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((q) => (
          <TouchableOpacity
            key={q.key}
            style={styles.quickTile}
            onPress={() => goTab(q.key)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIcon, { backgroundColor: q.color }]}>
              <Ionicons name={q.icon} size={20} color={COLORS.white} />
            </View>
            <Text style={styles.quickLabel}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipLabel}>DAILY TIP</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Healthy Urban Living</Text>
        <TouchableOpacity onPress={() => navigation.navigate("UrbanLivingScreen")}>
          <Text style={styles.seeAll}>Open</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.urbanRow}>
        {URBAN_CARDS.map((c) => (
          <TouchableOpacity
            key={c.title}
            style={[styles.urbanCard, { backgroundColor: c.tint }]}
            onPress={() => navigation.navigate("UrbanLivingScreen")}
            activeOpacity={0.85}
          >
            <View style={[styles.urbanIcon, { backgroundColor: c.color }]}>
              <Ionicons name={c.icon} size={14} color={COLORS.white} />
            </View>
            <Text numberOfLines={1} style={styles.urbanTitle}>{c.title}</Text>
            <Text numberOfLines={2} style={styles.urbanSub}>{c.sub}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Picks for {city}</Text>
        <TouchableOpacity onPress={() => goTab("Shop")}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      {loadingPicks ? (
        <View style={{ padding: SPACING.xl, alignItems: "center" }}>
          <ActivityIndicator color={COLORS.green} />
        </View>
      ) : picks.length === 0 ? (
        <View style={{ padding: SPACING.lg }}>
          <Text style={{ ...TYPE.body, color: COLORS.muted }}>
            No picks for your region right now. Try the Shop tab.
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.picksRow}>
          {picks.map((p) => (
            <TouchableOpacity key={p._id || p.id} style={styles.pickCard} onPress={() => goTab("Shop")}>
              <View style={styles.pickImg}>
                <Ionicons name="leaf" size={28} color={COLORS.green} />
              </View>
              <Text numberOfLines={1} style={styles.pickName}>{p.name}</Text>
              <Text style={styles.pickPrice}>{"\u20B9"}{p.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  band: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl + 4, paddingBottom: SPACING.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, ...SHADOWS.bandSm },
  greeting: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "700" },
  name: { color: COLORS.white, fontSize: 22, fontWeight: "900", marginTop: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  metaText: { color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: "800" },
  metaDot: { color: "rgba(255,255,255,0.7)", marginHorizontal: 4 },
  bell: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },

  quickRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: SPACING.lg, marginTop: -SPACING.lg },
  quickTile: { alignItems: "center", backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, minWidth: 70, ...SHADOWS.sm },
  quickIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  quickLabel: { ...TYPE.caption, color: COLORS.text, marginTop: 6 },

  tipBox: { marginHorizontal: SPACING.lg, marginTop: SPACING.lg, backgroundColor: COLORS.bluePale, padding: SPACING.md, borderRadius: RADIUS.md, borderLeftWidth: 4, borderLeftColor: COLORS.blueDeep },
  tipLabel: { ...TYPE.micro, color: COLORS.blueDeep, letterSpacing: 1 },
  tipText: { ...TYPE.body, color: COLORS.text, marginTop: 4 },

  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: SPACING.lg, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  sectionTitle: { ...TYPE.title, color: COLORS.text },
  seeAll: { ...TYPE.caption, color: COLORS.green },

  urbanRow: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  urbanCard: { width: 130, padding: SPACING.sm, borderRadius: RADIUS.md, ...SHADOWS.sm },
  urbanIcon: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  urbanTitle: { ...TYPE.body, color: COLORS.text, fontSize: 12 },
  urbanSub: { ...TYPE.micro, color: COLORS.muted, marginTop: 2 },

  picksRow: { paddingHorizontal: SPACING.lg, gap: SPACING.md },
  pickCard: { width: 110, backgroundColor: COLORS.white, padding: SPACING.sm, borderRadius: RADIUS.md, ...SHADOWS.sm },
  pickImg: { height: 70, borderRadius: RADIUS.sm, backgroundColor: COLORS.greenPale, alignItems: "center", justifyContent: "center", marginBottom: SPACING.sm },
  pickName: { ...TYPE.caption, color: COLORS.text },
  pickPrice: { ...TYPE.body, color: COLORS.green, marginTop: 2 },
});
