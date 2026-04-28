import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import API from "../services/api";
import { AppContext } from "../context/AppContext";
import colors from "../utils/colors";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesRes = await API.get("/products/categories/list");
      setCategories(categoriesRes.data);

      // Fetch featured products (all products)
      const productsRes = await API.get("/products");
      setFeaturedProducts(productsRes.data.slice(0, 6)); // Show first 6
    } catch (err) {
      Alert.alert("Error", "Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: () => {
          logout();
        },
        style: "destructive"
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome 👋</Text>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Reward Points</Text>
          <Text style={styles.statValue}>{user?.rewardPoints || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Mobile</Text>
          <Text style={styles.statValue}>{user?.mobile}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("ShopScreen")}
        >
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={styles.actionLabel}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Text style={styles.actionIcon}>🛍️</Text>
          <Text style={styles.actionLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("GardenScreen")}
        >
          <Text style={styles.actionIcon}>🌱</Text>
          <Text style={styles.actionLabel}>My Garden</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("Orders")}
        >
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionLabel}>Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.categoryChip}
              onPress={() =>
                navigation.navigate("ShopScreen", { category })
              }
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ShopScreen")}
          >
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <TouchableOpacity
              key={product._id}
              style={styles.productCard}
              onPress={() =>
                navigation.navigate("ShopScreen", { productId: product._id })
              }
            >
              <View style={styles.productImage}>
                <Text style={styles.productImageText}>
                  {product.category === "Seeds" ? "🌾" : product.category === "Saplings" ? "🌱" : product.category === "Minerals" ? "💪" : "📦"}
                </Text>
              </View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCategory}>{product.category}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{product.price}</Text>
              </View>
              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => {
                  Alert.alert("Added to Cart", `${product.name} added to cart!`);
                  navigation.navigate("CartScreen");
                }}
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipTitle}>💡 Daily Tip</Text>
        <Text style={styles.tipText}>
          Water your plants early in the morning for best results. This helps prevent fungal infections and allows plants to absorb water before the sun gets too hot.
        </Text>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16
  },
  welcomeText: {
    fontSize: 14,
    color: "#666"
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text
  },
  logoutBtn: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  logoutText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600"
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    alignItems: "center"
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginBottom: 20,
    gap: 8
  },
  actionCard: {
    width: "23%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0"
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center"
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text
  },
  viewAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600"
  },
  categoryChip: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500"
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between"
  },
  productCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    overflow: "hidden"
  },
  productImage: {
    height: 80,
    backgroundColor: colors.light,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  productImageText: {
    fontSize: 36
  },
  productName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2
  },
  productCategory: {
    fontSize: 10,
    color: "#999",
    marginBottom: 6
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary
  },
  addToCartBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center"
  },
  addToCartText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600"
  },
  tipsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8
  },
  tipText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18
  }
});
