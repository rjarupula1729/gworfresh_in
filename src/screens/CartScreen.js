import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AppContext } from "../context/AppContext";
import API from "../services/api";

export default function CartScreen() {
  const { cart, setCart, token } = useContext(AppContext);

  const checkout = async () => {
    const res = await API.post(
      "/orders",
      {
        items: cart,
        total: cart.reduce((sum, i) => sum + i.price, 0)
      },
      {
        headers: { Authorization: token }
      }
    );

    alert(`Order placed! 🎉 You earned ${res.data.pointsEarned} points`);

    setCart([]);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Cart Items: {cart.length}</Text>

      <Button title="Checkout" onPress={checkout} />
    </View>
  );
}