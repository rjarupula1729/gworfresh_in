import React, { useEffect, useState, useContext, useCallback } from "react";import React, { useEffect, useState, useContext } from "react";

import {import { View, Text, Button } from "react-native";

  View,import API from "../services/api";

  Text,import { AppContext } from "../context/AppContext";

  ScrollView,

  TouchableOpacity,export default function GardenScreen() {

  StyleSheet,  const [plants, setPlants] = useState([]);

  Alert,  const { token } = useContext(AppContext);

  ActivityIndicator,

  RefreshControl,  const fetchPlants = async () => {

} from "react-native";    const res = await API.get("/garden", {

import API from "../services/api";      headers: { Authorization: token }

import { AppContext } from "../context/AppContext";    });

import { COLORS, GRADIENTS } from "../utils/colors";    setPlants(res.data);

import { SPACING, RADIUS, SHADOWS, TYPE } from "../utils/theme";  };

import ScreenHeader from "../components/ScreenHeader";

import SectionHeader from "../components/SectionHeader";  useEffect(() => {

import EmptyState from "../components/EmptyState";    fetchPlants();

import BrandCard from "../components/BrandCard";  }, []);

import InfoChip from "../components/InfoChip";

  const addPlant = async () => {

const PLANT_ICON = {    await API.post("/garden", {

  Tomato: "🍅",      type: "Tomato",

  Chilli: "🌶️",      daysPlanted: 1,

  Mint: "🌿",      totalDays: 60

  Basil: "🌱",    }, {

  Lettuce: "🥬",      headers: { Authorization: token }

  Spinach: "🥬",    });

  Coriander: "🌿",

};    fetchPlants();

  };

export default function GardenScreen({ navigation }) {

  const { token } = useContext(AppContext);  return (

  const [plants, setPlants] = useState([]);    <View style={{ padding: 20 }}>

  const [loading, setLoading] = useState(true);      <Button title="Add Tomato Plant" onPress={addPlant} />

  const [refreshing, setRefreshing] = useState(false);      {plants.map((p, i) => (

        <Text key={i}>{p.type} - Day {p.daysPlanted}</Text>

  const fetchPlants = useCallback(async () => {      ))}

    try {    </View>

      const res = await API.get("/garden", { headers: { Authorization: token } });  );

      setPlants(res.data || []);}
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlants();
  };

  const addPlant = (type) => {
    Alert.alert("Add Plant", `Add a ${type} plant?`, [
      { text: "Cancel" },
      {
        text: "Add",
        onPress: async () => {
          try {
            await API.post(
              "/garden",
              { type, daysPlanted: 1, totalDays: 60 },
              { headers: { Authorization: token } }
            );
            fetchPlants();
          } catch (e) {
            Alert.alert("Error", "Failed to add plant");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  const totalPlants = plants.length;
  const healthyCount = plants.filter((p) => (p.daysPlanted || 0) > 0).length;

  return (
    <View style={styles.root}>
      <ScreenHeader title="My Garden 🌱" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.green]} tintColor={COLORS.green} />
        }
      >
        {/* Stats hero */}
        <View style={styles.section}>
          <BrandCard
            gradient={GRADIENTS.fresh}
            icon="🌿"
            title={`${totalPlants} Plants Growing`}
            subtitle={`${healthyCount} healthy · keep nurturing`}
            chip="THRIVING"
          />
        </View>

        {/* Quick add */}
        <View style={styles.section}>
          <SectionHeader title="Quick Add" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: SPACING.sm, paddingVertical: 4 }}
          >
            {Object.keys(PLANT_ICON).map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.addPill}
                onPress={() => addPlant(type)}
                activeOpacity={0.85}
              >
                <Text style={{ fontSize: 18 }}>{PLANT_ICON[type]}</Text>
                <Text style={styles.addPillText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Plants list */}
        <View style={styles.section}>
          <SectionHeader title="My Plants" />
          {plants.length === 0 ? (
            <EmptyState
              icon="🌱"
              title="No plants yet"
              subtitle="Tap a plant above to start growing"
            />
          ) : (
            <View style={{ gap: SPACING.sm }}>
              {plants.map((p, idx) => {
                const days = p.daysPlanted || 1;
                const total = p.totalDays || 60;
                const pct = Math.min(100, Math.round((days / total) * 100));
                return (
                  <TouchableOpacity
                    key={p._id || idx}
                    style={styles.plantCard}
                    activeOpacity={0.85}
                    onPress={() => navigation?.navigate?.("PlantTrackingScreen", { plantId: p._id })}
                  >
                    <View style={styles.plantIcon}>
                      <Text style={{ fontSize: 32 }}>{PLANT_ICON[p.type] || "🌱"}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.plantHead}>
                        <Text style={styles.plantName}>{p.type}</Text>
                        <InfoChip
                          label={pct >= 100 ? "READY" : `${pct}%`}
                          variant={pct >= 100 ? "sun" : "green"}
                        />
                      </View>
                      <Text style={styles.plantSub}>
                        Day {days} of {total}
                      </Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${pct}%` }]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Smart tip */}
        <View style={styles.section}>
          <BrandCard
            gradient={GRADIENTS.sky}
            icon="💧"
            title="Smart Watering Tip"
            subtitle="Water before 8 AM for best absorption"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },

  addPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.greenPale,
    ...SHADOWS.sm,
  },
  addPillText: { color: COLORS.green, fontWeight: "700", fontSize: 12 },

  plantCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  plantIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.greenPale,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  plantHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  plantName: { ...TYPE.card, color: COLORS.text },
  plantSub: { ...TYPE.caption, color: COLORS.muted, marginTop: 2, marginBottom: 6 },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.greenPale,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.green,
    borderRadius: 999,
  },
});
