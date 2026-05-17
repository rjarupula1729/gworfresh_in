import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";
import API from "../services/api";
import { COLORS, GRADIENTS } from "../utils/colors";
import { SPACING, RADIUS, SHADOWS, TYPE } from "../utils/theme";
import InfoChip from "../components/InfoChip";

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser, wishlist, futurePlants, growPoints, communities } = useContext(AppContext);

  const [editOpen, setEditOpen] = useState(false);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [familyBusy, setFamilyBusy] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    city: user?.city || "",
  });
  const [family, setFamily] = useState(user?.family || []);
  const [newMember, setNewMember] = useState({ name: "", relation: "", age: "" });

  // Refresh /auth/me on mount so we always show server-truth.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await API.get("/auth/me");
        if (cancelled) return;
        const u = res.data || {};
        setProfile({
          name: u.name || "",
          email: u.email || "",
          mobile: u.mobile || "",
          city: u.city || "",
        });
        setFamily(u.family || []);
        await updateUser(u);
      } catch (e) {
        // silent — keep cached user
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initial = (profile.name || "U").trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await API.put("/auth/me", {
        name: profile.name,
        email: profile.email,
        city: profile.city,
      });
      await updateUser(res.data);
      Alert.alert("Saved", "Profile updated successfully");
      setEditOpen(false);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.msg || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addFamily = async () => {
    if (!newMember.name || !newMember.relation) {
      return Alert.alert("Missing", "Please add name and relation");
    }
    setFamilyBusy(true);
    try {
      const res = await API.post("/auth/family", newMember);
      setFamily(res.data || []);
      await updateUser({ family: res.data || [] });
      setNewMember({ name: "", relation: "", age: "" });
    } catch (err) {
      Alert.alert("Error", err.response?.data?.msg || "Failed to add member");
    } finally {
      setFamilyBusy(false);
    }
  };

  const removeFamily = async (memberId) => {
    setFamilyBusy(true);
    try {
      const res = await API.delete(`/auth/family/${memberId}`);
      setFamily(res.data || []);
      await updateUser({ family: res.data || [] });
    } catch (err) {
      Alert.alert("Error", err.response?.data?.msg || "Failed to remove member");
    } finally {
      setFamilyBusy(false);
    }
  };

  const goToTab = (tab) => navigation.navigate("Main", { screen: tab });

  return (
    <View style={styles.root}>
      {/* Gradient profile header (HTML .profile-header) */}
      <LinearGradient colors={GRADIENTS.primary} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.phone}>+91 {profile.mobile || "—"}</Text>
            <View style={{ marginTop: 6 }}>
              <InfoChip label={`${user?.rewardPoints || 0} POINTS`} variant="sun" icon="⭐" />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 40 }}>
        {/* Personal */}
        <SectionLabel label="PERSONAL" />
        <Card>
          <Row
            icon="✏️"
            title="Edit Profile"
            sub="Name · email · city · mobile"
            onPress={() => setEditOpen(true)}
          />
          <Row
            icon="👨‍👩‍👧"
            title="Family Members"
            sub={`${family.length} members linked`}
            onPress={() => setFamilyOpen(true)}
          />
          <Row icon="📍" title="Addresses" sub="Manage delivery addresses" />
        </Card>

        {/* Activity */}
        <SectionLabel label="MY ACTIVITY" />
        <Card>
          <Row
            icon="📦"
            title="My Orders"
            sub="Track recent purchases"
            onPress={() => goToTab("Orders")}
          />
          <Row
            icon="🌱"
            title="My Garden"
            sub="Plants you're growing"
            onPress={() => goToTab("Garden")}
          />
          <Row
            icon="💬"
            title="Community"
            sub="Posts · comments · likes"
            onPress={() => goToTab("Community")}
          />
          <Row
            icon="👨‍🏫"
            title="Expert Consultants"
            sub="Bookings · sessions"
            onPress={() => navigation.navigate("InstructorBookingScreen")}
          />
          <Row
            icon="❤️"
            title="My Wishlist"
            sub={`${wishlist?.length || 0} saved ${(wishlist?.length || 0) === 1 ? "item" : "items"}`}
            onPress={() => navigation.navigate("WishlistScreen")}
          />
          <Row
            icon="🌱"
            title="Future Plants"
            sub={`${futurePlants?.length || 0} planned`}
            onPress={() => navigation.navigate("FuturePlantsScreen")}
          />
        </Card>

        {/* Wellness */}
        <SectionLabel label="WELLNESS & REWARDS" />
        <Card>
          <Row
            icon="💚"
            title="Healthy Urban Living"
            sub="Breathing · Breaks · 1-Hour for You"
            onPress={() => navigation.navigate("UrbanLivingScreen")}
          />
          <Row icon="🥗" title="Healthy Eating" sub="Recipes · Meal planner" />
          <Row
            icon="🎁"
            title="GrowPoints & Rewards"
            sub={`${growPoints || 0} pts · Earn · Redeem`}
            onPress={() => navigation.navigate("AchievementsScreen")}
          />
          <Row
            icon="🌐"
            title="Communities Hub"
            sub={`${communities?.length || 0} joined · Discover groups`}
            onPress={() => navigation.navigate("CommunitiesHubScreen")}
          />
          <Row icon="♻️" title="Soil Health" sub="Compost · Carbon impact" />
        </Card>

        {/* Settings */}
        <SectionLabel label="SETTINGS" />
        <Card>
          <Row icon="🔔" title="Notifications" sub="Push · Email · SMS" />
          <Row icon="🌐" title="Language" sub="English" />
          <Row icon="❓" title="Help & Support" sub="FAQs · Contact us" />
          <Row icon="📄" title="About" sub="Version 1.0.0" />
        </Card>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={18} color={COLORS.red} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={editOpen}
        onRequestClose={() => setEditOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Edit Profile</Text>
            <Field label="Full Name" value={profile.name} onChangeText={(t) => setProfile({ ...profile, name: t })} />
            <Field label="Email" value={profile.email} onChangeText={(t) => setProfile({ ...profile, email: t })} keyboardType="email-address" />
            <Field label="Mobile" value={profile.mobile} onChangeText={(t) => setProfile({ ...profile, mobile: t })} keyboardType="phone-pad" />
            <Field label="City" value={profile.city} onChangeText={(t) => setProfile({ ...profile, city: t })} />

            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[styles.sheetBtn, styles.sheetBtnGhost]}
                onPress={() => setEditOpen(false)}
                disabled={saving}
              >
                <Text style={styles.sheetBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sheetBtn, styles.sheetBtnPrimary, saving && { opacity: 0.6 }]}
                onPress={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.sheetBtnPrimaryText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Family Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={familyOpen}
        onRequestClose={() => setFamilyOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.sheet, { maxHeight: "85%" }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Family Members</Text>

            <ScrollView style={{ maxHeight: 220 }}>
              {family.length === 0 ? (
                <Text style={{ ...TYPE.body, color: COLORS.muted, paddingVertical: SPACING.md, textAlign: "center" }}>
                  No family members yet
                </Text>
              ) : (
                family.map((m, i) => (
                  <View key={m._id || i} style={styles.famRow}>
                    <View style={styles.famIcon}>
                      <Text style={{ fontSize: 18 }}>👤</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.famName}>{m.name}</Text>
                      <Text style={styles.famSub}>{m.relation}{m.age ? ` · ${m.age} yrs` : ""}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeFamily(m._id)}
                      hitSlop={10}
                      disabled={familyBusy || !m._id}
                    >
                      <Ionicons name="trash-outline" size={18} color={COLORS.red} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            <Text style={[styles.sheetTitle, { fontSize: 13, marginTop: SPACING.md }]}>Add Member</Text>
            <Field label="Name" value={newMember.name} onChangeText={(t) => setNewMember({ ...newMember, name: t })} />
            <Field label="Relation" value={newMember.relation} onChangeText={(t) => setNewMember({ ...newMember, relation: t })} />
            <Field label="Age" value={newMember.age} onChangeText={(t) => setNewMember({ ...newMember, age: t })} keyboardType="number-pad" />

            <View style={styles.sheetActions}>
              <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnGhost]} onPress={() => setFamilyOpen(false)} disabled={familyBusy}>
                <Text style={styles.sheetBtnGhostText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sheetBtn, styles.sheetBtnPrimary, familyBusy && { opacity: 0.6 }]}
                onPress={addFamily}
                disabled={familyBusy}
              >
                {familyBusy ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.sheetBtnPrimaryText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────
function SectionLabel({ label }) {
  return <Text style={styles.secLabel}>{label}</Text>;
}

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

function Row({ icon, title, sub, onPress }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      <Text style={styles.rowArrow}>›</Text>
    </TouchableOpacity>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <View style={{ marginBottom: SPACING.sm }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor={COLORS.muted}
        style={styles.fieldInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerTop: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "900", color: COLORS.white },
  name: { fontSize: 20, fontWeight: "900", color: COLORS.white },
  phone: { fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: "600", marginTop: 2 },

  // Sections
  secLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.muted,
    letterSpacing: 0.8,
    marginTop: SPACING.lg,
    marginBottom: 8,
    paddingLeft: 3,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowIcon: { fontSize: 20 },
  rowTitle: { fontSize: 13, fontWeight: "800", color: COLORS.text },
  rowSub: { fontSize: 10, color: COLORS.muted, fontWeight: "600", marginTop: 1 },
  rowArrow: { fontSize: 18, color: COLORS.muted, fontWeight: "700" },

  // Logout
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.redPale,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    marginTop: SPACING.xl,
    gap: 8,
    ...SHADOWS.sm,
  },
  logoutText: { color: COLORS.red, fontWeight: "800", fontSize: 14, letterSpacing: 0.3 },

  // Modal sheet
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
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  sheetActions: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.md },
  sheetBtn: { flex: 1, paddingVertical: 12, borderRadius: RADIUS.sm, alignItems: "center" },
  sheetBtnGhost: { backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border },
  sheetBtnGhostText: { color: COLORS.muted, fontWeight: "800", fontSize: 13 },
  sheetBtnPrimary: { backgroundColor: COLORS.green },
  sheetBtnPrimaryText: { color: COLORS.white, fontWeight: "800", fontSize: 13 },

  // Family rows
  famRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  famIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: COLORS.greenPale,
    justifyContent: "center",
    alignItems: "center",
  },
  famName: { fontSize: 13, fontWeight: "800", color: COLORS.text },
  famSub: { fontSize: 11, color: COLORS.muted, fontWeight: "600", marginTop: 1 },

  // Fields
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.muted,
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: COLORS.bg,
  },
});
