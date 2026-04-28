import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator
} from "react-native";
import API from "../services/api";
import { AppContext } from "../context/AppContext";
import colors from "../utils/colors";

export default function CartScreen({ navigation }) {
  const { cart, setCart, user } = useContext(AppContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });
  const [paymentMethod, setPaymentMethod] = useState("Online");

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
  };

  const clearCart = () => {
    Alert.alert("Clear Cart", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Clear",
        onPress: () => setCart([]),
        style: "destructive"
      }
    ]);
  };

  const handlePlaceOrder = async () => {
    if (!address.line1 || !address.city || !address.state || !address.pincode) {
      Alert.alert("Missing Address", "Please fill all address fields");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Add items to cart before placing order");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        address,
        paymentMethod
      };

      const response = await API.post("/orders", orderData);

      Alert.alert(
        "Order Placed!",
        `Order ID: ${response.data._id}\n\nYou earned 10 reward points!`,
        [
          {
            text: "View Order",
            onPress: () => {
              setCart([]);
              setShowCheckout(false);
              navigation.navigate("Orders", { orderId: response.data._id });
            }
          }
        ]
      );
    } catch (err) {
      Alert.alert("Error", err.response?.data?.msg || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !showCheckout) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Browse our collection and add items to get started
        </Text>
        <TouchableOpacity
          style={styles.continueShopping}
          onPress={() => navigation.navigate("ShopScreen")}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showCheckout) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowCheckout(false)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressForm}>
            <TextInput
              style={styles.input}
              placeholder="Address Line 1 *"
              value={address.line1}
              onChangeText={(text) => setAddress({ ...address, line1: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Address Line 2"
              value={address.line2}
              onChangeText={(text) => setAddress({ ...address, line2: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="City *"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="State *"
              value={address.state}
              onChangeText={(text) => setAddress({ ...address, state: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode *"
              value={address.pincode}
              onChangeText={(text) => setAddress({ ...address, pincode: text })}
              keyboardType="number-pad"
            />
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "Online" && styles.paymentOptionActive
              ]}
              onPress={() => setPaymentMethod("Online")}
            >
              <Text style={styles.paymentIcon}>💳</Text>
              <Text style={styles.paymentLabel}>Online Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "COD" && styles.paymentOptionActive
              ]}
              onPress={() => setPaymentMethod("COD")}
            >
              <Text style={styles.paymentIcon}>💵</Text>
              <Text style={styles.paymentLabel}>Cash on Delivery</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryBox}>
            {cart.map((item) => (
              <View key={item.productId} style={styles.summaryItem}>
                <Text style={styles.summaryItemName}>
                  {item.name} x {item.quantity}
                </Text>
                <Text style={styles.summaryItemPrice}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalLabel}>Total Amount</Text>
              <Text style={styles.summaryTotalPrice}>₹{calculateTotal()}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.placeOrderBtn, loading && styles.buttonDisabled]}
            onPress={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.placeOrderBtnText}>Place Order</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({cart.length})</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cartList}>
        {cart.map((item) => (
          <View key={item.productId} style={styles.cartItem}>
            <View style={styles.cartItemImage}>
              <Text style={styles.cartItemEmoji}>📦</Text>
            </View>

            <View style={styles.cartItemDetails}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemPrice}>₹{item.price}</Text>
            </View>

            <View style={styles.cartItemControls}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.productId, item.quantity - 1)}
              >
                <Text style={styles.quantityBtnText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.cartItemQuantity}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFromCart(item.productId)}
              >
                <Text style={styles.removeBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => setShowCheckout(true)}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  backButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text
  },
  clearText: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "600"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8
  },
  emptyText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20
  },
  continueShopping: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  continueShoppingText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600"
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 10,
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
