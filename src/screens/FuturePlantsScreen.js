// FuturePlantsScreen — plant ideas the user wants to grow later.
// Persists via AppContext (AsyncStorage). Add with name+emoji+note+plannedFor.
import React, { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppContext } from "../context/AppContext";
import { COLORS } from "../utils/colors";
import { RADIUS, SHADOWS, SPACING, TYPE } from "../utils/theme";

const EMOJIS = ["🌱", "🌿", "🌸", "🌹", "🌻", "🌷", "🌼", "🍅", "🌶️", "🥬", "🥕", "🥭", "🍋", "🌽", "🍓", "🥒"];

export default function FuturePlantsScreen({ navigation }) {
  const { futurePlants, addFuturePlant, removeFuturePlant, clearFuturePlants } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🌱");
  const [note, setNote] = useState("");
  const [plannedFor, setPlannedFor] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setName(""); setEmoji("🌱"); setNote(""); setPlannedFor("");
  };

  const save = async () => {
    if (!name.trim()) {
      return Alert.alert("Missing name", "Please give your plant a name");
    }
    setSaving(true);
    try {
      await addFuturePlant({ name: name.trim(), emoji, note: note.trim(), plannedFor: plannedFor.trim() });
      setOpen(false);
      reset();
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = (p) => {
    Alert.alert("Remove plant", `Remove "${p.name}" from your plans?`, [
      { text: "Cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeFuturePlant(p.id) },
    ]);
  };

  const confirmClear = () => {
    Alert.alert("Clear all", "Remove all future plant plans?", [
      { text: "Cancel" },
      { text: "Clear", style: "destructive", onPress: () => clearFuturePlants() },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.thumb}>
        <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
        {!!item.plannedFor && (
          <Text style={styles.meta}>🗓️ {item.plannedFor}</Text>
        )}
        {!!item.note && (
          <Text numberOfLines={2} style={styles.note}>{item.note}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => confirmRemove(item)}
        hitSlop={10}
        style={styles.removeBtn}
      >
        <Ionicons name="trash-outline" size={16} color={COLORS.red} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={styles.title}>Future Plants</Text>
          <Text style={styles.sub}>
            {futurePlants.length} {futurePlants.length === 1 ? "plan" : "plans"}
          </Text>
        </View>
        {futurePlants.length > 0 && (
          <TouchableOpacity onPress={confirmClear} hitSlop={10}>
            <Text style={styles.clear}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {futurePlants.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 48 }}>🌱</Text>
          <Text style={styles.emptyTitle}>Plan your future garden</Text>
          <Text style={styles.emptySub}>Save plant ideas with when you'd like to grow them.</Text>
          <TouchableOpacity style={styles.addCta} onPress={() => setOpen(true)}>
            <Ionicons name="add" size={16} color={COLORS.white} />
            <Text style={styles.addCtaText}>Add your first plan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={futurePlants}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.sm, paddingBottom: 120 }}
        />
      )}

      {/* FAB */}
      {futurePlants.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.85}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}

      {/* Add modal */}
      <Modal
        transparent
        animationType="slide"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Plan a plant</Text>

            <Text style={styles.label}>Pick an icon</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: SPACING.sm, paddingVertical: SPACING.sm }}
            >
              {EMOJIS.map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setEmoji(e)}
                  style={[styles.emojiTile, emoji === e && styles.emojiTileActive]}
                >
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Cherry tomato"
              placeholderTextColor={COLORS.muted}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Plan to grow on</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Next monsoon · Oct 2026"
              placeholderTextColor={COLORS.muted}
              value={plannedFor}
              onChangeText={setPlannedFor}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: "top" }]}
              placeholder="Soil, sunlight, seed source…"
              placeholderTextColor={COLORS.muted}
              value={note}
              onChangeText={setNote}
              multiline
            />

            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnGhost]}
                onPress={() => { setOpen(false); reset(); }}
                disabled={saving}
              >
                <Text style={styles.btnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, saving && { opacity: 0.6 }]}
                onPress={save}
                disabled={saving}
              >
                <Text style={styles.btnPrimaryText}>Save plan</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  title: { ...TYPE.title, color: COLORS.text },
  sub: { ...TYPE.caption, color: COLORS.muted },
  clear: { ...TYPE.caption, color: COLORS.red },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  thumb: {
    width: 50, height: 50, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.greenPale,
    alignItems: "center", justifyContent: "center",
  },
  name: { ...TYPE.card, color: COLORS.text },
  meta: { ...TYPE.caption, color: COLORS.green, marginTop: 2 },
  note: { ...TYPE.micro, color: COLORS.muted, marginTop: 4 },
  removeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.redPale,
    alignItems: "center", justifyContent: "center",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl, gap: SPACING.sm },
  emptyTitle: { ...TYPE.title, color: COLORS.text },
  emptySub: { ...TYPE.body, color: COLORS.muted, textAlign: "center" },
  addCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.green,
  },
  addCtaText: { color: COLORS.white, fontWeight: "900" },

  fab: {
    position: "absolute",
    bottom: 28, right: 24,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.green,
    alignItems: "center", justifyContent: "center",
    ...SHADOWS.md,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  sheetTitle: { ...TYPE.title, color: COLORS.text, marginBottom: SPACING.sm },
  label: { ...TYPE.caption, color: COLORS.muted, marginTop: SPACING.sm, marginBottom: 4 },
  input: {
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...TYPE.body,
    color: COLORS.text,
  },
  emojiTile: {
    width: 44, height: 44, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bg,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "transparent",
  },
  emojiTileActive: { borderColor: COLORS.green, backgroundColor: COLORS.greenPale },

  sheetActions: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.lg },
  btn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.pill, alignItems: "center" },
  btnGhost: { backgroundColor: COLORS.bg },
  btnGhostText: { ...TYPE.body, color: COLORS.muted },
  btnPrimary: { backgroundColor: COLORS.green },
  btnPrimaryText: { color: COLORS.white, fontWeight: "900" },
});
