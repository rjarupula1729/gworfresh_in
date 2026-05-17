// UrbanLivingScreen — port of the Healthy Urban Living section in the HTML.
// 5 wellness cards + working box-breathing timer + WFH micro-break tiles +
// "1-Hour for Yourself" tracker. State persists daily via AppContext.
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
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

const BREAK_TILES = [
  { idx: 0, icon: "sunny",      label: "Sunrise",  hint: "5 min" },
  { idx: 1, icon: "cafe",       label: "Mid-AM",   hint: "Tea + stretch" },
  { idx: 2, icon: "restaurant", label: "Lunch",    hint: "Mindful eat" },
  { idx: 3, icon: "walk",       label: "Mid-PM",   hint: "Walk 5 min" },
  { idx: 4, icon: "moon",       label: "Wind-down",hint: "Phone away" },
];

// Box-breathing: 4s in, 4s hold, 4s out, 4s hold. 6 cycles = 96s.
const PHASES = [
  { label: "Breathe in", secs: 4 },
  { label: "Hold",       secs: 4 },
  { label: "Breathe out",secs: 4 },
  { label: "Hold",       secs: 4 },
];
const TOTAL_CYCLES = 6;

export default function UrbanLivingScreen({ navigation }) {
  const { todayWellness, toggleBreak, markBreathing, markHourForYou, growPoints } = useContext(AppContext);
  const today = todayWellness();

  const completedBreaks = today.breaks.filter(Boolean).length;
  const progressPct = Math.round(((completedBreaks + (today.breathing ? 1 : 0) + (today.hourForYou ? 1 : 0)) / 7) * 100);

  // Breathing modal
  const [breathOpen, setBreathOpen] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secLeft, setSecLeft] = useState(PHASES[0].secs);
  const [cycle, setCycle] = useState(1);
  const tickRef = useRef(null);

  useEffect(() => {
    if (!breathOpen) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    setPhaseIdx(0); setSecLeft(PHASES[0].secs); setCycle(1);
    tickRef.current = setInterval(() => {
      setSecLeft((s) => {
        if (s > 1) return s - 1;
        // advance phase
        setPhaseIdx((p) => {
          const np = (p + 1) % PHASES.length;
          if (np === 0) {
            setCycle((c) => {
              const nc = c + 1;
              if (nc > TOTAL_CYCLES) {
                // done
                if (tickRef.current) clearInterval(tickRef.current);
                setTimeout(async () => {
                  await markBreathing();
                  setBreathOpen(false);
                  Alert.alert("Nice work", "+10 GrowPoints for box-breathing");
                }, 0);
                return c;
              }
              return nc;
            });
          }
          return np;
        });
        return PHASES[(phaseIdx + 1) % PHASES.length].secs;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathOpen]);

  const onHour = async () => {
    if (today.hourForYou) return Alert.alert("Already logged", "You've earned today's 1-Hour for Yourself.");
    Alert.alert(
      "1-Hour for Yourself",
      "Confirm that you spent an hour today doing something just for you (reading, gardening, a walk, etc).",
      [
        { text: "Not yet" },
        {
          text: "Yes, I did", onPress: async () => {
            await markHourForYou();
            Alert.alert("Beautiful!", "+25 GrowPoints");
          }
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <LinearGradient colors={GRADIENTS.fresh} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={styles.headerTitle}>Healthy Urban Living</Text>
          <Text style={styles.headerSub}>{progressPct}% of today complete - {growPoints} pts</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 60 }}>
        {/* Today's progress bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: progressPct + "%" }]} />
          </View>
          <Text style={styles.progressLabel}>
            {completedBreaks}/5 breaks - {today.breathing ? "B" : "-"} breathing - {today.hourForYou ? "1h" : "-"} self
          </Text>
        </View>

        {/* Stress reset (box-breathing) */}
        <Text style={styles.sectionTitle}>5-Min Stress Reset</Text>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: COLORS.purplePale }]}
          onPress={() => setBreathOpen(true)}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.purple }]}>
            <Ionicons name="leaf" size={22} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Box Breathing</Text>
            <Text style={styles.actionSub}>4-4-4-4 x 6 cycles - {today.breathing ? "Done today" : "+10 pts"}</Text>
          </View>
          <Ionicons name={today.breathing ? "checkmark-circle" : "play-circle"} size={28} color={today.breathing ? COLORS.green : COLORS.purple} />
        </TouchableOpacity>

        {/* Mid-meeting breaks */}
        <Text style={styles.sectionTitle}>Mid-Meeting Breaks</Text>
        <Text style={styles.sectionSub}>Tap each as you complete it. +5 pts each.</Text>
        <View style={styles.breakGrid}>
          {BREAK_TILES.map((b) => {
            const done = today.breaks[b.idx];
            return (
              <Pressable
                key={b.idx}
                style={[styles.breakTile, done && styles.breakTileDone]}
                onPress={() => toggleBreak(b.idx)}
              >
                <Ionicons name={b.icon} size={20} color={done ? COLORS.white : COLORS.green} />
                <Text style={[styles.breakLabel, done && { color: COLORS.white }]}>{b.label}</Text>
                <Text style={[styles.breakHint, done && { color: "rgba(255,255,255,0.85)" }]}>{b.hint}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Balcony Boost */}
        <Text style={styles.sectionTitle}>Balcony Boost</Text>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: COLORS.greenPale }]}
          onPress={() => navigation.navigate("Main", { screen: "Garden" })}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.green }]}>
            <Ionicons name="sunny" size={22} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>10-minute plant care</Text>
            <Text style={styles.actionSub}>Water, prune, observe - open your Garden</Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color={COLORS.green} />
        </TouchableOpacity>

        {/* Family time */}
        <Text style={styles.sectionTitle}>Family Time</Text>
        <View style={[styles.actionCard, { backgroundColor: COLORS.orangePale }]}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.orangeDeep }]}>
            <Ionicons name="people" size={22} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Garden together</Text>
            <Text style={styles.actionSub}>Invite a family member to today's care</Text>
          </View>
        </View>

        {/* 1 hour for yourself */}
        <Text style={styles.sectionTitle}>1-Hour for Yourself</Text>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: COLORS.yellowPale }]}
          onPress={onHour}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.yellow }]}>
            <Ionicons name="time" size={22} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Did you take an hour today?</Text>
            <Text style={styles.actionSub}>{today.hourForYou ? "Logged - thank you" : "+25 pts when you confirm"}</Text>
          </View>
          <Ionicons name={today.hourForYou ? "checkmark-circle" : "ellipse-outline"} size={28} color={today.hourForYou ? COLORS.green : COLORS.orangeDeep} />
        </TouchableOpacity>
      </ScrollView>

      {/* Breathing modal */}
      <Modal transparent animationType="fade" visible={breathOpen} onRequestClose={() => setBreathOpen(false)}>
        <View style={styles.bOverlay}>
          <View style={styles.bSheet}>
            <Text style={styles.bCycle}>Cycle {cycle} / {TOTAL_CYCLES}</Text>
            <View style={styles.bCircleWrap}>
              <View style={[
                styles.bCircle,
                phaseIdx === 0 && { transform: [{ scale: 1.0 }] },
                phaseIdx === 1 && { transform: [{ scale: 1.15 }] },
                phaseIdx === 2 && { transform: [{ scale: 0.85 }] },
                phaseIdx === 3 && { transform: [{ scale: 0.85 }] },
              ]}>
                <Text style={styles.bSec}>{secLeft}</Text>
              </View>
            </View>
            <Text style={styles.bPhase}>{PHASES[phaseIdx].label}</Text>
            <TouchableOpacity style={styles.bClose} onPress={() => setBreathOpen(false)}>
              <Text style={styles.bCloseText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.lg },
  headerTitle: { ...TYPE.title, color: COLORS.white },
  headerSub: { ...TYPE.caption, color: "rgba(255,255,255,0.9)", marginTop: 2 },

  progressCard: { backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.lg, ...SHADOWS.sm },
  progressBar: { height: 10, backgroundColor: COLORS.greenPale, borderRadius: 5, overflow: "hidden" },
  progressFill: { height: 10, backgroundColor: COLORS.green },
  progressLabel: { ...TYPE.caption, color: COLORS.muted, marginTop: 6 },

  sectionTitle: { ...TYPE.title, color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm, fontSize: 14 },
  sectionSub: { ...TYPE.caption, color: COLORS.muted, marginBottom: SPACING.sm },

  actionCard: { flexDirection: "row", alignItems: "center", padding: SPACING.md, borderRadius: RADIUS.md, gap: SPACING.md, ...SHADOWS.sm },
  actionIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  actionTitle: { ...TYPE.card, color: COLORS.text },
  actionSub: { ...TYPE.micro, color: COLORS.muted, marginTop: 2 },

  breakGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  breakTile: { width: "31%", backgroundColor: COLORS.white, padding: SPACING.sm, borderRadius: RADIUS.sm, alignItems: "center", ...SHADOWS.sm },
  breakTileDone: { backgroundColor: COLORS.green },
  breakLabel: { ...TYPE.caption, color: COLORS.text, marginTop: 4 },
  breakHint: { ...TYPE.micro, color: COLORS.muted, marginTop: 2, textAlign: "center" },

  bOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", alignItems: "center", justifyContent: "center" },
  bSheet: { alignItems: "center", padding: SPACING.xl, gap: SPACING.lg },
  bCycle: { color: COLORS.white, fontSize: 14, fontWeight: "800" },
  bCircleWrap: { width: 220, height: 220, alignItems: "center", justifyContent: "center" },
  bCircle: { width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(102,187,106,0.85)", alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: "rgba(255,255,255,0.45)" },
  bSec: { color: COLORS.white, fontSize: 56, fontWeight: "900" },
  bPhase: { color: COLORS.white, fontSize: 22, fontWeight: "900" },
  bClose: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.pill, backgroundColor: "rgba(255,255,255,0.18)" },
  bCloseText: { color: COLORS.white, fontWeight: "900" },
});
