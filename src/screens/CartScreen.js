import React, { useState, useContext } from "react";import React, { useState, useContext } from "react";

import {import {

  View,  View,

  Text,  Text,

  ScrollView,  ScrollView,

  TouchableOpacity,  TouchableOpacity,

  StyleSheet,  StyleSheet,

  Alert,  Alert,

  TextInput,  TextInput,

  ActivityIndicator,  ActivityIndicator

} from "react-native";} from "react-native";

import API from "../services/api";import API from "../services/api";

import { AppContext } from "../context/AppContext";import { AppContext } from "../context/AppContext";

import { COLORS, GRADIENTS } from "../utils/colors";import colors from "../utils/colors";

import { SPACING, RADIUS, SHADOWS, TYPE } from "../utils/theme";

import ScreenHeader from "../components/ScreenHeader";export default function CartScreen({ navigation }) {

import SectionHeader from "../components/SectionHeader";  const { cart, setCart, user } = useContext(AppContext);

import EmptyState from "../components/EmptyState";  const [showCheckout, setShowCheckout] = useState(false);

import BrandCard from "../components/BrandCard";  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({

export default function CartScreen({ navigation }) {    line1: "",

  const { cart, setCart } = useContext(AppContext);    line2: "",

  const [showCheckout, setShowCheckout] = useState(false);    city: "",

  const [loading, setLoading] = useState(false);    state: "",

  const [address, setAddress] = useState({    pincode: "",

    line1: "",    country: "India"

    line2: "",  });

    city: "",  const [paymentMethod, setPaymentMethod] = useState("Online");

    state: "",

    pincode: "",  const calculateTotal = () => {

    country: "India",    return cart.reduce((total, item) => total + item.price * item.quantity, 0);

  });  };

  const [paymentMethod, setPaymentMethod] = useState("Online");

  const updateQuantity = (productId, newQuantity) => {

  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);    if (newQuantity <= 0) {

      removeFromCart(productId);

  const updateQty = (id, qty) => {      return;

    if (qty <= 0) return removeItem(id);    }

    setCart(cart.map((i) => (i.productId === id ? { ...i, quantity: qty } : i)));

  };    const updatedCart = cart.map(item =>

      item.productId === productId

  const removeItem = (id) => setCart(cart.filter((i) => i.productId !== id));        ? { ...item, quantity: newQuantity }

        : item

  const clearCart = () => {    );

    Alert.alert("Clear Cart", "Are you sure?", [    setCart(updatedCart);

      { text: "Cancel" },  };

      { text: "Clear", style: "destructive", onPress: () => setCart([]) },

    ]);  const removeFromCart = (productId) => {

  };    const updatedCart = cart.filter(item => item.productId !== productId);

    setCart(updatedCart);

  const placeOrder = async () => {  };

    if (!address.line1 || !address.city || !address.state || !address.pincode) {

      return Alert.alert("Missing Address", "Please fill all required address fields");  const clearCart = () => {

    }    Alert.alert("Clear Cart", "Are you sure?", [

    if (cart.length === 0) {      { text: "Cancel", onPress: () => {} },

      return Alert.alert("Empty Cart", "Add items to cart before placing order");      {

    }        text: "Clear",

    setLoading(true);        onPress: () => setCart([]),

    try {        style: "destructive"

      const res = await API.post("/orders", {      }

        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),    ]);

        address,  };

        paymentMethod,

      });  const handlePlaceOrder = async () => {

      Alert.alert("Order Placed!", `Order ID: ${res.data._id}\n\n+10 reward points`, [    if (!address.line1 || !address.city || !address.state || !address.pincode) {

        {      Alert.alert("Missing Address", "Please fill all address fields");

          text: "View Order",      return;

          onPress: () => {    }

            setCart([]);

            setShowCheckout(false);    if (cart.length === 0) {

            navigation.navigate("Orders", { orderId: res.data._id });      Alert.alert("Empty Cart", "Add items to cart before placing order");

          },      return;

        },    }

      ]);

    } catch (err) {    setLoading(true);

      Alert.alert("Error", err.response?.data?.msg || "Failed to place order");    try {

    } finally {      const orderData = {

      setLoading(false);        items: cart.map(item => ({

    }          productId: item.productId,

  };          quantity: item.quantity

        })),

  // -------- EMPTY --------        address,

  if (cart.length === 0 && !showCheckout) {        paymentMethod

    return (      };

      <View style={styles.root}>

        <ScreenHeader title="My Cart" onBack={() => navigation.goBack()} />      const response = await API.post("/orders", orderData);

        <EmptyState

          icon="🛒"      Alert.alert(

          title="Your cart is empty"        "Order Placed!",

          subtitle="Browse our collection and add fresh picks"        `Order ID: ${response.data._id}\n\nYou earned 10 reward points!`,

          ctaLabel="Continue Shopping"        [

          onCtaPress={() => navigation.navigate("ShopScreen")}          {

        />            text: "View Order",

      </View>            onPress: () => {

    );              setCart([]);

  }              setShowCheckout(false);

              navigation.navigate("Orders", { orderId: response.data._id });

  // -------- CHECKOUT --------            }

  if (showCheckout) {          }

    return (        ]

      <View style={styles.root}>      );

        <ScreenHeader title="Checkout" onBack={() => setShowCheckout(false)} />    } catch (err) {

        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">      Alert.alert("Error", err.response?.data?.msg || "Failed to place order");

          <View style={styles.section}>    } finally {

            <SectionHeader title="Delivery Address" />      setLoading(false);

            <View style={styles.formCard}>    }

              <Input placeholder="Address Line 1 *" value={address.line1} onChangeText={(t) => setAddress({ ...address, line1: t })} />  };

              <Input placeholder="Address Line 2" value={address.line2} onChangeText={(t) => setAddress({ ...address, line2: t })} />

              <Input placeholder="City *" value={address.city} onChangeText={(t) => setAddress({ ...address, city: t })} />  if (cart.length === 0 && !showCheckout) {

              <Input placeholder="State *" value={address.state} onChangeText={(t) => setAddress({ ...address, state: t })} />    return (

              <Input placeholder="Pincode *" value={address.pincode} onChangeText={(t) => setAddress({ ...address, pincode: t })} keyboardType="number-pad" />      <View style={styles.emptyContainer}>

            </View>        <Text style={styles.emptyIcon}>🛒</Text>

          </View>        <Text style={styles.emptyTitle}>Your cart is empty</Text>

        <Text style={styles.emptyText}>

          <View style={styles.section}>          Browse our collection and add items to get started

            <SectionHeader title="Payment Method" />        </Text>

            <View style={styles.payRow}>        <TouchableOpacity

              <PayOption          style={styles.continueShopping}

                active={paymentMethod === "Online"}          onPress={() => navigation.navigate("ShopScreen")}

                onPress={() => setPaymentMethod("Online")}        >

                icon="💳"          <Text style={styles.continueShoppingText}>Continue Shopping</Text>

                label="Online"        </TouchableOpacity>

              />      </View>

              <PayOption    );

                active={paymentMethod === "COD"}  }

                onPress={() => setPaymentMethod("COD")}

                icon="💵"  if (showCheckout) {

                label="Cash on Delivery"    return (

              />      <View style={styles.container}>

            </View>        <View style={styles.header}>

          </View>          <TouchableOpacity onPress={() => setShowCheckout(false)}>

            <Text style={styles.backButton}>← Back</Text>

          <View style={styles.section}>          </TouchableOpacity>

            <SectionHeader title="Order Summary" />          <Text style={styles.headerTitle}>Checkout</Text>

            <View style={styles.summaryCard}>          <View style={{ width: 50 }} />

              {cart.map((i) => (        </View>

                <View key={i.productId} style={styles.summaryRow}>

                  <Text style={styles.summaryName} numberOfLines={1}>        <ScrollView style={styles.content}>

                    {i.name} × {i.quantity}          <Text style={styles.sectionTitle}>Delivery Address</Text>

                  </Text>          <View style={styles.addressForm}>

                  <Text style={styles.summaryPrice}>₹{i.price * i.quantity}</Text>            <TextInput

                </View>              style={styles.input}

              ))}              placeholder="Address Line 1 *"

              <View style={styles.divider} />              value={address.line1}

              <View style={styles.summaryRow}>              onChangeText={(text) => setAddress({ ...address, line1: text })}

                <Text style={styles.totalLabel}>Total</Text>            />

                <Text style={styles.totalAmount}>₹{total}</Text>            <TextInput

              </View>              style={styles.input}

            </View>              placeholder="Address Line 2"

          </View>              value={address.line2}

              onChangeText={(text) => setAddress({ ...address, line2: text })}

          <View style={styles.section}>            />

            <TouchableOpacity            <TextInput

              style={[styles.placeBtn, loading && { opacity: 0.6 }]}              style={styles.input}

              onPress={placeOrder}              placeholder="City *"

              disabled={loading}              value={address.city}

              activeOpacity={0.85}              onChangeText={(text) => setAddress({ ...address, city: text })}

            >            />

              {loading ? (            <TextInput

                <ActivityIndicator color={COLORS.white} />              style={styles.input}

              ) : (              placeholder="State *"

                <Text style={styles.placeBtnText}>Place Order · ₹{total}</Text>              value={address.state}

              )}              onChangeText={(text) => setAddress({ ...address, state: text })}

            </TouchableOpacity>            />

          </View>            <TextInput

        </ScrollView>              style={styles.input}

      </View>              placeholder="Pincode *"

    );              value={address.pincode}

  }              onChangeText={(text) => setAddress({ ...address, pincode: text })}

              keyboardType="number-pad"

  // -------- CART LIST --------            />

  return (          </View>

    <View style={styles.root}>

      <ScreenHeader          <Text style={styles.sectionTitle}>Payment Method</Text>

        title={`My Cart (${cart.length})`}          <View style={styles.paymentMethods}>

        onBack={() => navigation.goBack()}            <TouchableOpacity

        right={              style={[

          <TouchableOpacity onPress={clearCart} hitSlop={10}>                styles.paymentOption,

            <Text style={styles.headerClear}>Clear</Text>                paymentMethod === "Online" && styles.paymentOptionActive

          </TouchableOpacity>              ]}

        }              onPress={() => setPaymentMethod("Online")}

      />            >

              <Text style={styles.paymentIcon}>💳</Text>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 120 }}>              <Text style={styles.paymentLabel}>Online Payment</Text>

        {cart.map((item) => (            </TouchableOpacity>

          <View key={item.productId} style={styles.itemCard}>            <TouchableOpacity

            <View style={styles.itemImg}>              style={[

              <Text style={{ fontSize: 28 }}>📦</Text>                styles.paymentOption,

            </View>                paymentMethod === "COD" && styles.paymentOptionActive

            <View style={{ flex: 1 }}>              ]}

              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>              onPress={() => setPaymentMethod("COD")}

              <Text style={styles.itemPrice}>₹{item.price}</Text>            >

              <View style={styles.qtyRow}>              <Text style={styles.paymentIcon}>💵</Text>

                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.productId, item.quantity - 1)}>              <Text style={styles.paymentLabel}>Cash on Delivery</Text>

                  <Text style={styles.qtyBtnText}>−</Text>            </TouchableOpacity>

                </TouchableOpacity>          </View>

                <Text style={styles.qtyValue}>{item.quantity}</Text>

                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.productId, item.quantity + 1)}>          <Text style={styles.sectionTitle}>Order Summary</Text>

                  <Text style={styles.qtyBtnText}>+</Text>          <View style={styles.summaryBox}>

                </TouchableOpacity>            {cart.map((item) => (

                <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.productId)} hitSlop={8}>              <View key={item.productId} style={styles.summaryItem}>

                  <Text style={{ fontSize: 16 }}>🗑️</Text>                <Text style={styles.summaryItemName}>

                </TouchableOpacity>                  {item.name} x {item.quantity}

              </View>                </Text>

            </View>                <Text style={styles.summaryItemPrice}>

          </View>                  ₹{item.price * item.quantity}

        ))}                </Text>

      </ScrollView>              </View>

            ))}

      <View style={styles.footer}>            <View style={styles.summaryDivider} />

        <View>            <View style={styles.summaryTotal}>

          <Text style={styles.footerLabel}>Subtotal</Text>              <Text style={styles.summaryTotalLabel}>Total Amount</Text>

          <Text style={styles.footerTotal}>₹{total}</Text>              <Text style={styles.summaryTotalPrice}>₹{calculateTotal()}</Text>

        </View>            </View>

        <TouchableOpacity          </View>

          style={styles.checkoutBtn}

          onPress={() => setShowCheckout(true)}          <TouchableOpacity

          activeOpacity={0.85}            style={[styles.placeOrderBtn, loading && styles.buttonDisabled]}

        >            onPress={handlePlaceOrder}

          <Text style={styles.checkoutBtnText}>Checkout →</Text>            disabled={loading}

        </TouchableOpacity>          >

      </View>            {loading ? (

    </View>              <ActivityIndicator color={colors.white} />

  );            ) : (

}              <Text style={styles.placeOrderBtnText}>Place Order</Text>

            )}

function Input(props) {          </TouchableOpacity>

  return (

    <TextInput          <View style={{ height: 20 }} />

      {...props}        </ScrollView>

      placeholderTextColor={COLORS.muted}      </View>

      style={styles.input}    );

    />  }

  );

}  return (

    <View style={styles.container}>

function PayOption({ active, onPress, icon, label }) {      <View style={styles.header}>

  return (        <TouchableOpacity onPress={() => navigation.goBack()}>

    <TouchableOpacity          <Text style={styles.backButton}>← Back</Text>

      style={[styles.payOption, active && styles.payOptionActive]}        </TouchableOpacity>

      onPress={onPress}        <Text style={styles.headerTitle}>Cart ({cart.length})</Text>

      activeOpacity={0.85}        <TouchableOpacity onPress={clearCart}>

    >          <Text style={styles.clearText}>Clear</Text>

      <Text style={{ fontSize: 22, marginBottom: 4 }}>{icon}</Text>        </TouchableOpacity>

      <Text style={[styles.payLabel, active && styles.payLabelActive]}>{label}</Text>      </View>

    </TouchableOpacity>

  );      <ScrollView style={styles.cartList}>

}        {cart.map((item) => (

          <View key={item.productId} style={styles.cartItem}>

const styles = StyleSheet.create({            <View style={styles.cartItemImage}>

  root: { flex: 1, backgroundColor: COLORS.bg },              <Text style={styles.cartItemEmoji}>📦</Text>

  headerClear: { color: COLORS.white, fontWeight: "800", fontSize: 13 },            </View>

  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },

            <View style={styles.cartItemDetails}>

  // Cart list              <Text style={styles.cartItemName}>{item.name}</Text>

  itemCard: {              <Text style={styles.cartItemPrice}>₹{item.price}</Text>

    flexDirection: "row",            </View>

    backgroundColor: COLORS.white,

    borderRadius: RADIUS.md,            <View style={styles.cartItemControls}>

    padding: SPACING.sm,              <TouchableOpacity

    marginBottom: SPACING.sm,                style={styles.quantityBtn}

    alignItems: "center",                onPress={() => updateQuantity(item.productId, item.quantity - 1)}

    ...SHADOWS.sm,              >

  },                <Text style={styles.quantityBtnText}>−</Text>

  itemImg: {              </TouchableOpacity>

    width: 64,

    height: 64,              <Text style={styles.cartItemQuantity}>{item.quantity}</Text>

    borderRadius: RADIUS.sm,

    backgroundColor: COLORS.greenPale,              <TouchableOpacity

    justifyContent: "center",                style={styles.quantityBtn}

    alignItems: "center",                onPress={() => updateQuantity(item.productId, item.quantity + 1)}

    marginRight: SPACING.md,              >

  },                <Text style={styles.quantityBtnText}>+</Text>

  itemName: { ...TYPE.card, color: COLORS.text },              </TouchableOpacity>

  itemPrice: { fontSize: 13, fontWeight: "800", color: COLORS.green, marginTop: 2 },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 6 },              <TouchableOpacity

  qtyBtn: {                style={styles.removeBtn}

    width: 28,                onPress={() => removeFromCart(item.productId)}

    height: 28,              >

    borderRadius: 6,                <Text style={styles.removeBtnText}>🗑️</Text>

    backgroundColor: COLORS.greenPale,              </TouchableOpacity>

    justifyContent: "center",            </View>

    alignItems: "center",          </View>

  },        ))}

  qtyBtnText: { fontSize: 14, color: COLORS.green, fontWeight: "900" },      </ScrollView>

  qtyValue: { fontSize: 13, fontWeight: "800", color: COLORS.text, minWidth: 20, textAlign: "center" },

  removeBtn: { marginLeft: "auto", padding: 4 },      <View style={styles.footer}>

        <View style={styles.totalContainer}>

  footer: {          <Text style={styles.totalLabel}>Total:</Text>

    position: "absolute",          <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>

    left: 0,        </View>

    right: 0,

    bottom: 0,        <TouchableOpacity

    backgroundColor: COLORS.white,          style={styles.checkoutBtn}

    paddingHorizontal: SPACING.lg,          onPress={() => setShowCheckout(true)}

    paddingTop: SPACING.md,        >

    paddingBottom: SPACING.lg,          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>

    borderTopWidth: 1,        </TouchableOpacity>

    borderTopColor: COLORS.border,      </View>

    flexDirection: "row",    </View>

    alignItems: "center",  );

    justifyContent: "space-between",}

    ...SHADOWS.md,

  },const styles = StyleSheet.create({

  footerLabel: { ...TYPE.caption, color: COLORS.muted },  container: {

  footerTotal: { fontSize: 20, fontWeight: "900", color: COLORS.green },    flex: 1,

  checkoutBtn: {    backgroundColor: colors.light

    backgroundColor: COLORS.green,  },

    borderRadius: RADIUS.pill,  header: {

    paddingHorizontal: SPACING.xl,    flexDirection: "row",

    paddingVertical: 12,    justifyContent: "space-between",

  },    alignItems: "center",

  checkoutBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.3 },    paddingHorizontal: 16,

    paddingTop: 12,

  // Checkout    paddingBottom: 12,

  formCard: {    backgroundColor: colors.white,

    backgroundColor: COLORS.white,    borderBottomWidth: 1,

    borderRadius: RADIUS.md,    borderBottomColor: "#EEE"

    padding: SPACING.md,  },

    ...SHADOWS.sm,  backButton: {

  },    fontSize: 14,

  input: {    color: colors.primary,

    borderWidth: 1,    fontWeight: "600"

    borderColor: COLORS.border,  },

    borderRadius: RADIUS.sm,  headerTitle: {

    paddingHorizontal: SPACING.md,    fontSize: 18,

    paddingVertical: 10,    fontWeight: "bold",

    marginBottom: SPACING.sm,    color: colors.text

    fontSize: 13,  },

    color: COLORS.text,  clearText: {

    backgroundColor: COLORS.bg,    fontSize: 12,

  },    color: "#FF6B6B",

  payRow: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.sm },    fontWeight: "600"

  payOption: {  },

    flex: 1,  emptyContainer: {

    backgroundColor: COLORS.white,    flex: 1,

    borderRadius: RADIUS.md,    justifyContent: "center",

    padding: SPACING.md,    alignItems: "center",

    alignItems: "center",    backgroundColor: colors.light

    borderWidth: 2,  },

    borderColor: COLORS.border,  emptyIcon: {

    ...SHADOWS.sm,    fontSize: 80,

  },    marginBottom: 16

  payOptionActive: {  },

    borderColor: COLORS.green,  emptyTitle: {

    backgroundColor: COLORS.greenPale,    fontSize: 20,

  },    fontWeight: "bold",

  payLabel: { fontSize: 12, fontWeight: "700", color: COLORS.muted },    color: colors.text,

  payLabelActive: { color: COLORS.greenDeep },    marginBottom: 8

  },

  summaryCard: {  emptyText: {

    backgroundColor: COLORS.white,    fontSize: 13,

    borderRadius: RADIUS.md,    color: "#999",

    padding: SPACING.md,    textAlign: "center",

    ...SHADOWS.sm,    marginBottom: 24,

  },    paddingHorizontal: 20

  summaryRow: {  },

    flexDirection: "row",  continueShopping: {

    justifyContent: "space-between",    backgroundColor: colors.primary,

    alignItems: "center",    borderRadius: 10,

    paddingVertical: 6,    paddingHorizontal: 24,

  },    paddingVertical: 12

  summaryName: { ...TYPE.body, color: COLORS.text, flex: 1, marginRight: SPACING.sm },  },

  summaryPrice: { ...TYPE.body, fontWeight: "700", color: COLORS.text },  continueShoppingText: {

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 6 },    color: colors.white,

  totalLabel: { ...TYPE.card, color: COLORS.text },    fontSize: 14,

  totalAmount: { fontSize: 18, fontWeight: "900", color: COLORS.green },    fontWeight: "600"

  },

  placeBtn: {  cartList: {

    backgroundColor: COLORS.green,    flex: 1,

    borderRadius: RADIUS.sm,    paddingHorizontal: 16,

    paddingVertical: 14,    paddingVertical: 12

    alignItems: "center",  },

    ...SHADOWS.md,  cartItem: {

  },    flexDirection: "row",

  placeBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 15, letterSpacing: 0.4 },    backgroundColor: colors.white,

});    borderRadius: 10,

    padding: 12,
    marginBottom: 12,
    alignItems: "center"
  },
  cartItemImage: {
    width: 60,
    height: 60,
    backgroundColor: colors.light,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  cartItemEmoji: {
    fontSize: 24
  },
  cartItemDetails: {
    flex: 1
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4
  },
  cartItemPrice: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600"
  },
  cartItemControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  quantityBtnText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold"
  },
  cartItemQuantity: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.text,
    minWidth: 20,
    textAlign: "center"
  },
  removeBtn: {
    marginLeft: 4
  },
  removeBtnText: {
    fontSize: 16
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE"
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666"
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center"
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold"
  },

  // Checkout Styles
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    marginTop: 16
  },
  addressForm: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 13,
    color: colors.text
  },
  paymentMethods: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16
  },
  paymentOption: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DDD"
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.light
  },
  paymentIcon: {
    fontSize: 28,
    marginBottom: 6
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text
  },
  summaryBox: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  summaryItemName: {
    fontSize: 12,
    color: colors.text
  },
  summaryItemPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text
  },
  summaryTotalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary
  },
  placeOrderBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonDisabled: {
    opacity: 0.6
  },
  placeOrderBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold"
  }
});
