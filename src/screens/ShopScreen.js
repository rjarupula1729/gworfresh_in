import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button } from "react-native";
import API from "../services/api";
import { AppContext } from "../context/AppContext";

export default function ShopScreen() {
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useContext(AppContext);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <View style={{ padding: 20 }}>
      {products.map((p, i) => (
        <View key={i}>
          <Text>{p.emoji} {p.name} ₹{p.price}</Text>
          <Button title="Add" onPress={() => addToCart(p)} />
        </View>
      ))}
    </View>
  );
}