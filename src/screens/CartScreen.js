// CartScreen — list cart items, qty controls, summary & place order.
import React, { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
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

const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 499;

export default function CartScreen({ navigation }) {
  const { cart, setCart } = useContext(AppContext);
  const [placing, setPlacing] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((s, it) => s + it.price * it.quantity, 0),
    [cart]
  );
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const inc = (pid) => {
    setCart((prev) =>
      prev.map((c) => (c.productId === pid ? { ...c, quantity: c.quantity + 1 } : c))
    );
  };
  const dec = (pid) => {
    setCart((prev) =>
      prev
        .map((c) => (c.productId === pid ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  };
  const remove = (pid) => {
    setCart((prev) => prev.filter((c) => c.productId !== pid));
  };

  const clearAll = () => {
    Alert.alert("Clear cart", "Remove all items?", [
      { text: "Cancel" },
      { text: "Clear", style: "destructive", onPress: () => setCart([]) },
    ]);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      await API.post("/orders", {
        items: cart.map((c) => ({
          product_id: c.productId,
          name: c.name,
          price: c.price,
          quantity: c.quantity,
        })),
        subtotal,
        delivery_charge: delivery,
        total,
      });
      setCart([]);
      Alert.alert("Order placed", "Your order has been placed successfully.", [
        { text: "OK", onPress: () => navigation.navigate("Main", { screen: "Orders" }) },
      ]);
    } catch (e) {
      Alert.alert("Couldn't place order", e.response?.data?.msg || "Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const rupee = "\u20B9";

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={clearAll} disabled={cart.length === 0} hitSlop={10}>
          <Text style={[styles.clearBtn, cart.length === 0 && { opacity: 0.4 }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={48} color={COLORS.muted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add fresh seeds, saplings and tools to get started.</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate("Main", { screen: "Shop" })}
          >
            <Text style={styles.shopBtnText}>Browse Shop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 240 }}>
            {cart.map((item) => (
              <View key={item.productId} style={styles.row}>
                <View style={styles.thumb}>
                  <Ionicons name="leaf" size={22} color={COLORS.green} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowPrice}>{rupee}{item.price} each</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => dec(item.productId)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => inc(item.productId)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.lineTotal}>{rupee}{item.price * item.quantity}</Text>
                  <TouchableOpacity onPress={() => remove(item.productId)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={16} color={COLORS.red} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.summary}>
            {remainingForFree > 0 && (
              <Text style={styles.hint}>
                Add {rupee}{remainingForFree} more for FREE delivery
              </Text>
            )}
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Subtotal</Text>
              <Text style={styles.sumVal}>{rupee}{subtotal}</Text>
            </View>
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Delivery</Text>
              <Text style={[styles.sumVal, delivery === 0 && { color: COLORS.green }]}>
                {delivery === 0 ? "FREE" : (rupee + delivery)}
              </Text>
            </View>
            <View style={[styles.sumRow, { marginTop: 4 }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>{rupee}{total}</Text>
            </View>
            <TouchableOpacity
              style={[styles.placeBtn, placing && { opacity: 0.6 }]}
              onPress={placeOrder}
              disabled={placing}
            >
              {placing ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.placeBtnText}>Place Order - {rupee}{total}</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.sm },
  headerTitle: { ...TYPE.title, color: COLORS.text },
  clearBtn: { ...TYPE.caption, color: COLORS.red },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xxl, gap: SPACING.sm },
  emptyTitle: { ...TYPE.title, color: COLORS.text },
  emptySub: { ...TYPE.body, color: COLORS.muted, textAlign: "center" },
  shopBtn: { marginTop: SPACING.md, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.pill, backgroundColor: COLORS.green },
  shopBtnText: { color: COLORS.white, fontWeight: "900" },

  row: { flexDirection: "row", backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.md, ...SHADOWS.sm },
  thumb: { width: 56, height: 56, borderRadius: RADIUS.sm, backgroundColor: COLORS.greenPale, alignItems: "center", justifyContent: "center" },
  rowName: { ...TYPE.card, color: COLORS.text },
  rowPrice: { ...TYPE.caption, color: COLORS.muted, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.greenPale, alignSelf: "flex-start", borderRadius: RADIUS.pill, paddingHorizontal: 4, paddingVertical: 2, marginTop: 6, gap: 8 },
  qtyBtn: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center" },
  qtyBtnText: { color: COLORS.green, fontSize: 14, fontWeight: "900" },
  qtyText: { ...TYPE.caption, color: COLORS.text, minWidth: 14, textAlign: "center" },
  lineTotal: { ...TYPE.title, color: COLORS.text, marginBottom: 6 },

  summary: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg, paddingBottom: SPACING.xxl, ...SHADOWS.md },
  hint: { ...TYPE.caption, color: COLORS.orangeDeep, backgroundColor: COLORS.orangePale, padding: SPACING.sm, borderRadius: RADIUS.sm, marginBottom: SPACING.sm, textAlign: "center" },
  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  sumLabel: { ...TYPE.body, color: COLORS.muted },
  sumVal: { ...TYPE.body, color: COLORS.text },
  totalLabel: { ...TYPE.title, color: COLORS.text },
  totalVal: { ...TYPE.title, color: COLORS.green },
  placeBtn: { marginTop: SPACING.md, backgroundColor: COLORS.green, paddingVertical: SPACING.md, borderRadius: RADIUS.pill, alignItems: "center" },
  placeBtnText: { color: COLORS.white, fontWeight: "900", fontSize: 14 },
});
