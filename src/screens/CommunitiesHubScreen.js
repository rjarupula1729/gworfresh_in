// CommunitiesHubScreen — port of the Communities Hub from the HTML.
// Curated city/topic groups; join/leave persisted via AppContext.
import React, { useContext, useMemo, useState } from "react";
import {
  FlatList,
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

const COMMUNITIES = [
  { id: "hyd-balcony",    name: "Hyderabad Balcony Growers",  members: 2845, topic: "City",  icon: "business" },
  { id: "blr-terrace",    name: "Bangalore Terrace Farmers",  members: 4120, topic: "City",  icon: "business" },
  { id: "che-coastal",    name: "Chennai Coastal Gardens",    members: 1860, topic: "City",  icon: "business" },
  { id: "mum-flat",       name: "Mumbai Flat Forest",         members: 3675, topic: "City",  icon: "business" },
  { id: "del-winter",     name: "Delhi Winter Crops",         members: 2210, topic: "City",  icon: "business" },
  { id: "tomato-lovers",  name: "Tomato Lovers India",        members: 5240, topic: "Crop",  icon: "nutrition" },
  { id: "herb-club",      name: "Herb & Tea Club",            members: 3110, topic: "Crop",  icon: "leaf" },
  { id: "rose-keepers",   name: "Rose Keepers Society",       members: 1985, topic: "Crop",  icon: "rose" },
  { id: "compost-org",    name: "Compost & Soil Health",      members: 2750, topic: "Eco",   icon: "earth" },
  { id: "wellness-grow",  name: "Wellness Through Growing",   members: 4830, topic: "Wellness", icon: "heart" },
  { id: "kids-garden",    name: "Kids in the Garden",         members: 1420, topic: "Family", icon: "happy" },
  { id: "fasting-grow",   name: "Mindful Eating & Garden",    members: 980,  topic: "Wellness", icon: "restaurant" },
];

const TOPICS = ["All", "City", "Crop", "Eco", "Wellness", "Family"];

export default function CommunitiesHubScreen({ navigation }) {
  const { communities, toggleCommunity, isJoined } = useContext(AppContext);
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMUNITIES.filter((c) =>
      (topic === "All" || c.topic === topic) &&
      (!q || c.name.toLowerCase().includes(q))
    );
  }, [topic, query]);

  const joinedCount = communities.length;

  const renderItem = ({ item }) => {
    const joined = isJoined(item.id);
    return (
      <View style={styles.card}>
        <View style={[styles.icon, { backgroundColor: joined ? COLORS.greenPale : COLORS.bluePale }]}>
          <Ionicons name={item.icon} size={22} color={joined ? COLORS.green : COLORS.blueDeep} />
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>{item.members.toLocaleString()} members - {item.topic}</Text>
        </View>
        <TouchableOpacity
          style={[styles.joinBtn, joined && styles.joinedBtn]}
          onPress={() => toggleCommunity(item.id)}
        >
          <Text style={[styles.joinBtnText, joined && { color: COLORS.green }]}>
            {joined ? "Joined" : "Join"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={styles.title}>Communities Hub</Text>
          <Text style={styles.sub}>{joinedCount} joined - {COMMUNITIES.length} available</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={COLORS.muted} />
        <TextInput
          placeholder="Search communities"
          placeholderTextColor={COLORS.muted}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        {!!query && (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.topicRow}>
        {TOPICS.map((t) => {
          const active = t === topic;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTopic(t)}
              style={[styles.topicPill, active && styles.topicPillActive]}
            >
              <Text style={[styles.topicText, active && styles.topicTextActive]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.sm, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ ...TYPE.body, color: COLORS.muted }}>No communities match</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.sm },
  title: { ...TYPE.title, color: COLORS.text },
  sub: { ...TYPE.caption, color: COLORS.muted, marginTop: 2 },

  searchBox: { flexDirection: "row", alignItems: "center", marginHorizontal: SPACING.lg, backgroundColor: COLORS.white, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, height: 40, gap: SPACING.sm, ...SHADOWS.sm },
  searchInput: { flex: 1, ...TYPE.body, color: COLORS.text, padding: 0 },

  topicRow: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.sm },
  topicPill: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.pill, backgroundColor: COLORS.white, ...SHADOWS.sm },
  topicPillActive: { backgroundColor: COLORS.green },
  topicText: { ...TYPE.caption, color: COLORS.text },
  topicTextActive: { color: COLORS.white },

  card: { flexDirection: "row", alignItems: "center", padding: SPACING.md, gap: SPACING.md, backgroundColor: COLORS.white, borderRadius: RADIUS.md, ...SHADOWS.sm },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  name: { ...TYPE.card, color: COLORS.text },
  meta: { ...TYPE.caption, color: COLORS.muted, marginTop: 2 },
  joinBtn: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.pill, backgroundColor: COLORS.green },
  joinedBtn: { backgroundColor: COLORS.greenPale },
  joinBtnText: { color: COLORS.white, fontSize: 11, fontWeight: "900" },

  empty: { padding: SPACING.xl, alignItems: "center" },
});
