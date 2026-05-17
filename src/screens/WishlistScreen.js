// WishlistScreen — shows products the user has wished from Shop.
// Loads full product catalog and filters by wishlist IDs from AppContext.
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import API from "../services/api";
import { AppContext } from "../context/AppContext";
import { COLORS } from "../utils/colors";
import { RADIUS, SHADOWS, SPACING, TYPE } from "../utils/theme";

export default function WishlistScreen({ navigation }) {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    setCart,
  } = useContext(AppContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (wishlist.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/products");
      const all = Array.isArray(res.data) ? res.data : [];
      const set = new Set(wishlist.map(String));
      setItems(all.filter((p) => set.has(String(p._id || p.id))));
    } catch (e) {
      setError(e.response?.data?.msg || "Couldn't load wishlist");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [wishlist]);

  useEffect(() => { load(); }, [load]);

  const moveToCart = (p) => {
    const pid = p._id || p.id;
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.productId === pid);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { productId: pid, name: p.name, price: p.price, quantity: 1 }];
    });
    removeFromWishlist(pid);
  };

  const confirmClear = () => {
    Alert.alert("Clear wishlist", "Remove all wished products?", [
      { text: "Cancel" },
      { text: "Clear", style: "destructive", onPress: () => clearWishlist() },
    ]);
  };

  const renderItem = ({ item }) => {
    const pid = item._id || item.id;
    return (
      <View style={styles.card}>
        <View style={styles.thumb}>
          <Text style={{ fontSize: 30 }}>🌱</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
          {!!item.region && (
            <Text style={styles.region}>📍 {item.region}</Text>
          )}
          <Text style={styles.price}>₹{item.price}</Text>
        </View>
        <View style={{ gap: SPACING.sm }}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => moveToCart(item)}
          >
            <Ionicons name="cart" size={14} color={COLORS.white} />
            <Text style={styles.addBtnText}>Move</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeFromWishlist(pid)}
          >
            <Ionicons name="heart-dislike-outline" size={14} color={COLORS.red} />
          </TouchableOpacity>
        </View>
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
          <Text style={styles.title}>Wishlist</Text>
          <Text style={styles.sub}>{items.length} {items.length === 1 ? "item" : "items"}</Text>
        </View>
        {wishlist.length > 0 && (
          <TouchableOpacity onPress={confirmClear} hitSlop={10}>
            <Text style={styles.clear}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.green} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 48 }}>💚</Text>
          <Text style={styles.emptyTitle}>No wishes yet</Text>
          <Text style={styles.emptySub}>Tap the heart on any product in the Shop to save it here.</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate("Main", { screen: "Shop" })}
          >
            <Text style={styles.shopBtnText}>Go to Shop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it._id || it.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.sm, paddingBottom: 40 }}
        />
      )}
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
    width: 56, height: 56, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.greenPale,
    alignItems: "center", justifyContent: "center",
  },
  name: { ...TYPE.card, color: COLORS.text },
  region: { ...TYPE.micro, color: COLORS.muted, marginTop: 2 },
  price: { ...TYPE.title, color: COLORS.green, marginTop: 4 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.green,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  addBtnText: { color: COLORS.white, fontSize: 11, fontWeight: "900" },
  removeBtn: {
    alignSelf: "center",
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.redPale,
    alignItems: "center", justifyContent: "center",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl, gap: SPACING.sm },
  emptyTitle: { ...TYPE.title, color: COLORS.text },
  emptySub: { ...TYPE.body, color: COLORS.muted, textAlign: "center" },
  shopBtn: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.green,
  },
  shopBtnText: { color: COLORS.white, fontWeight: "900" },
  errorText: { ...TYPE.body, color: COLORS.red },
  retryBtn: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill, backgroundColor: COLORS.green,
  },
  retryBtnText: { color: COLORS.white, fontWeight: "900" },
});
