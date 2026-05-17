// ShopScreen — RN counterpart of Shop tab in growfresh-app.html.
// Backend-driven (GET /api/products?category=&region=&q=). 5 categories,
// region picker, search, 2-col grid with region pin (top-left), wishlist
// (top-right), category badge (bottom-left). Wishlist wired to AppContext.
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

import API from "../services/api";
import { AppContext } from "../context/AppContext";
import { COLORS } from "../utils/colors";
import { RADIUS, SHADOWS, SPACING, TYPE } from "../utils/theme";

const CATEGORIES = [
  { key: null, label: "All" },
  { key: "Seeds", label: "Seeds" },
  { key: "Saplings", label: "Saplings" },
  { key: "Minerals", label: "Minerals" },
  { key: "Compost", label: "Compost" },
  { key: "Tools", label: "Tools" },
];

const REGIONS = [
  "All regions",
  "Hyderabad", "Bangalore", "Chennai", "Mumbai",
  "Delhi", "Kolkata", "Pune", "Ahmedabad",
  "South India", "North India", "Coastal India", "Hill Stations",
  "All India",
];

const CAT_TINT = {
  Seeds: COLORS.greenPale,
  Saplings: COLORS.tealPale,
  Minerals: COLORS.bluePale,
  Compost: COLORS.brownPale,
  Tools: COLORS.orangePale,
};

const CAT_EMOJI = {
  Seeds: "S", Saplings: "S", Minerals: "M", Compost: "C", Tools: "T",
};

function pickEmoji(name, category) {
  const n = (name || "").toLowerCase();
  if (n.includes("tomato")) return "T";
  if (n.includes("chili") || n.includes("chilli") || n.includes("pepper")) return "P";
  if (n.includes("mango")) return "M";
  if (n.includes("lemon") || n.includes("lime")) return "L";
  if (n.includes("rose")) return "R";
  if (n.includes("mint") || n.includes("basil") || n.includes("tulsi")) return "B";
  if (n.includes("carrot")) return "C";
  if (n.includes("compost") || n.includes("manure")) return "E";
  if (n.includes("fertil") || n.includes("mineral") || n.includes("npk")) return "N";
  if (n.includes("tool") || n.includes("trowel") || n.includes("shovel") || n.includes("pruner")) return "T";
  return CAT_EMOJI[category] || "*";
}

export default function ShopScreen({ navigation }) {
  const { cart, setCart, isWished, toggleWishlist } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState(null);
  const [region, setRegion] = useState("All regions");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [regionOpen, setRegionOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const fetchProducts = useCallback(async () => {
    setError(null);
    try {
      const params = {};
      if (category) params.category = category;
      if (region && region !== "All regions") params.region = region;
      if (debouncedQuery) params.q = debouncedQuery;
      const res = await API.get("/products", { params });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e.response?.data?.msg || "Couldn't load products");
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category, region, debouncedQuery]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const cartQty = useCallback(
    (pid) => {
      const item = cart.find((c) => c.productId === pid);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  const addToCart = (p) => {
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
  };

  const decFromCart = (pid) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.productId === pid);
      if (idx < 0) return prev;
      const next = [...prev];
      const q = next[idx].quantity - 1;
      if (q <= 0) next.splice(idx, 1);
      else next[idx] = { ...next[idx], quantity: q };
      return next;
    });
  };

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.quantity, 0), [cart]);

  const renderItem = ({ item }) => {
    const pid = item._id || item.id;
    const qty = cartQty(pid);
    const wished = isWished(pid);
    const tint = CAT_TINT[item.category] || COLORS.greenPale;
    return (
      <View style={styles.card}>
        <View style={[styles.imageBox, { backgroundColor: tint }]}>
          {!!item.region && (
            <View style={styles.regionPin}>
              <Text numberOfLines={1} style={styles.regionPinText}>{item.region}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.wishBtn} onPress={() => toggleWishlist(pid)} hitSlop={8}>
            <Ionicons name={wished ? "heart" : "heart-outline"} size={16} color={wished ? COLORS.red : COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.emoji}>{pickEmoji(item.name, item.category)}</Text>
          {!!item.category && (
            <View style={styles.catBadge}>
              <Text style={styles.catBadgeText}>{String(item.category).toUpperCase()}</Text>
            </View>
          )}
        </View>

        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
        {!!item.description && (
          <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
        )}

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{"\u20B9"}{item.price}</Text>
          {qty === 0 ? (
            <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => decFromCart(pid)}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Shop</Text>
          <Text style={styles.subtitle}>{products.length} items - {region}</Text>
        </View>
        <TouchableOpacity style={styles.cartIconWrap} onPress={() => navigation.navigate("CartScreen")}>
          <Ionicons name="cart-outline" size={22} color={COLORS.text} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={COLORS.muted} />
          <TextInput
            placeholder="Search products"
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
        <TouchableOpacity style={styles.regionBtn} onPress={() => setRegionOpen(true)}>
          <Ionicons name="location-outline" size={14} color={COLORS.green} />
          <Text numberOfLines={1} style={styles.regionBtnText}>{region}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {CATEGORIES.map((c) => {
          const active = c.key === category;
          return (
            <Pressable
              key={c.label}
              onPress={() => setCategory(c.key)}
              style={[styles.catPill, active && styles.catPillActive]}
            >
              <Text style={[styles.catPillText, active && styles.catPillTextActive]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={COLORS.green} /></View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchProducts}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(it) => String(it._id || it.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: SPACING.md, paddingHorizontal: SPACING.lg }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: SPACING.sm, gap: SPACING.md }}
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchProducts(); }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ ...TYPE.body, color: COLORS.muted }}>No products found</Text>
            </View>
          }
        />
      )}

      <Modal transparent animationType="fade" visible={regionOpen} onRequestClose={() => setRegionOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setRegionOpen(false)}>
          <Pressable style={styles.regionSheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose region</Text>
            <ScrollView style={{ maxHeight: 380 }}>
              {REGIONS.map((r) => {
                const active = r === region;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.regionRow, active && { backgroundColor: COLORS.greenPale }]}
                    onPress={() => { setRegion(r); setRegionOpen(false); }}
                  >
                    <Ionicons name="location" size={16} color={active ? COLORS.green : COLORS.muted} />
                    <Text style={[styles.regionRowText, active && { color: COLORS.green }]}>{r}</Text>
                    {active && <Ionicons name="checkmark" size={16} color={COLORS.green} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.sm },
  title: { ...TYPE.hero, color: COLORS.text },
  subtitle: { ...TYPE.caption, color: COLORS.muted, marginTop: 2 },
  cartIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", ...SHADOWS.sm },
  cartBadge: { position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.red, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  cartBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: "900" },

  searchRow: { flexDirection: "row", gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, height: 40, gap: SPACING.sm, ...SHADOWS.sm },
  searchInput: { flex: 1, ...TYPE.body, color: COLORS.text, padding: 0 },
  regionBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, borderRadius: RADIUS.pill, maxWidth: 140, ...SHADOWS.sm },
  regionBtnText: { ...TYPE.caption, color: COLORS.text, maxWidth: 100 },

  catRow: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.sm },
  catPill: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.pill, backgroundColor: COLORS.white, ...SHADOWS.sm },
  catPillActive: { backgroundColor: COLORS.green },
  catPillText: { ...TYPE.caption, color: COLORS.text },
  catPillTextActive: { color: COLORS.white },

  card: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.sm, ...SHADOWS.sm },
  imageBox: { height: 110, borderRadius: RADIUS.sm, marginBottom: SPACING.sm, alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  emoji: { fontSize: 38, fontWeight: "900", color: COLORS.green },
  regionPin: { position: "absolute", top: 5, left: 5, backgroundColor: "rgba(255,255,255,0.92)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, maxWidth: "62%" },
  regionPinText: { fontSize: 9, fontWeight: "800", color: COLORS.text },
  wishBtn: { position: "absolute", top: 5, right: 5, width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" },
  catBadge: { position: "absolute", bottom: 5, left: 5, backgroundColor: "rgba(46,125,50,0.92)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  catBadgeText: { fontSize: 8, fontWeight: "900", color: COLORS.white, letterSpacing: 0.5 },

  name: { ...TYPE.card, color: COLORS.text },
  desc: { ...TYPE.micro, color: COLORS.muted, marginTop: 2 },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: SPACING.sm },
  price: { ...TYPE.title, color: COLORS.green },
  addBtn: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.pill, backgroundColor: COLORS.green },
  addBtnText: { color: COLORS.white, fontSize: 11, fontWeight: "900" },
  qtyRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.greenPale, borderRadius: RADIUS.pill, paddingHorizontal: 4, paddingVertical: 2, gap: 6 },
  qtyBtn: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center" },
  qtyBtnText: { color: COLORS.green, fontSize: 14, fontWeight: "900" },
  qtyText: { ...TYPE.caption, color: COLORS.text, minWidth: 14, textAlign: "center" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  errorText: { ...TYPE.body, color: COLORS.red, marginBottom: SPACING.md },
  retryBtn: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, backgroundColor: COLORS.green },
  retryBtnText: { color: COLORS.white, fontWeight: "900" },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  regionSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg, paddingBottom: SPACING.xxl },
  sheetHandle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, marginBottom: SPACING.md },
  sheetTitle: { ...TYPE.title, color: COLORS.text, marginBottom: SPACING.md },
  regionRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderRadius: RADIUS.sm },
  regionRowText: { ...TYPE.body, color: COLORS.text, flex: 1 },
});
