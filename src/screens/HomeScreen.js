import React, { useState, useEffect, useContext, useCallback } from "react";import React, { useState, useEffect, useContext } from "react";

import {import {

  View,  View,

  Text,  Text,

  ScrollView,  ScrollView,

  TouchableOpacity,  TouchableOpacity,

  StyleSheet,  StyleSheet,

  ActivityIndicator,  ActivityIndicator,

  RefreshControl,  RefreshControl,

  Alert,  Alert

} from "react-native";} from "react-native";

import API from "../services/api";import API from "../services/api";

import { AppContext } from "../context/AppContext";import { AppContext } from "../context/AppContext";

import { COLORS, GRADIENTS } from "../utils/colors";import colors from "../utils/colors";

import { SPACING, RADIUS, SHADOWS, TYPE } from "../utils/theme";

import ScreenHeader from "../components/ScreenHeader";export default function HomeScreen({ navigation }) {

import SectionHeader from "../components/SectionHeader";  const { user, logout } = useContext(AppContext);

import QuickAction from "../components/QuickAction";  const [categories, setCategories] = useState([]);

import BrandCard from "../components/BrandCard";  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [loading, setLoading] = useState(true);

export default function HomeScreen({ navigation }) {  const [refreshing, setRefreshing] = useState(false);

  const { user, logout } = useContext(AppContext);

  const [categories, setCategories] = useState([]);  useEffect(() => {

  const [featuredProducts, setFeaturedProducts] = useState([]);    fetchData();

  const [loading, setLoading] = useState(true);  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {

  const fetchData = useCallback(async () => {    try {

    try {      // Fetch categories

      const [catRes, prodRes] = await Promise.all([      const categoriesRes = await API.get("/products/categories/list");

        API.get("/products/categories/list"),      setCategories(categoriesRes.data);

        API.get("/products"),

      ]);      // Fetch featured products (all products)

      setCategories(catRes.data || []);      const productsRes = await API.get("/products");

      setFeaturedProducts((prodRes.data || []).slice(0, 6));      setFeaturedProducts(productsRes.data.slice(0, 6)); // Show first 6

    } catch (err) {    } catch (err) {

      Alert.alert("Error", "Failed to load data");      Alert.alert("Error", "Failed to load data");

      console.error(err);      console.error(err);

    } finally {    } finally {

      setLoading(false);      setLoading(false);

      setRefreshing(false);      setRefreshing(false);

    }    }

  }, []);  };



  useEffect(() => {  const onRefresh = () => {

    fetchData();    setRefreshing(true);

  }, [fetchData]);    fetchData();

  };

  const onRefresh = () => {

    setRefreshing(true);  const handleLogout = () => {

    fetchData();    Alert.alert("Logout", "Are you sure?", [

  };      { text: "Cancel", onPress: () => {} },

      {

  const handleLogout = () => {        text: "Logout",

    Alert.alert("Logout", "Are you sure?", [        onPress: () => {

      { text: "Cancel" },          logout();

      { text: "Logout", style: "destructive", onPress: () => logout() },        },

    ]);        style: "destructive"

  };      }

    ]);

  const iconFor = (cat) =>  };

    cat === "Seeds" ? "🌾" : cat === "Saplings" ? "🌱" : cat === "Minerals" ? "💪" : "📦";

  if (loading) {

  if (loading) {    return (

    return (      <View style={styles.centerContainer}>

      <View style={styles.center}>        <ActivityIndicator size="large" color={colors.primary} />

        <ActivityIndicator size="large" color={COLORS.green} />      </View>

      </View>    );

    );  }

  }

  return (

  return (    <ScrollView

    <View style={styles.root}>      style={styles.container}

      <ScreenHeader      refreshControl={

        title={`Hi, ${user?.name?.split(" ")[0] || "Friend"} 👋`}        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

        right={      }

          <TouchableOpacity onPress={handleLogout} hitSlop={10}>    >

            <Text style={styles.headerLink}>Logout</Text>      {/* Header */}

          </TouchableOpacity>      <View style={styles.header}>

        }        <View>

      />          <Text style={styles.welcomeText}>Welcome 👋</Text>

          <Text style={styles.userName}>{user?.name || "User"}</Text>

      <ScrollView        </View>

        style={styles.scroll}        <TouchableOpacity

        contentContainerStyle={{ paddingBottom: 32 }}          style={styles.logoutBtn}

        refreshControl={          onPress={handleLogout}

          <RefreshControl        >

            refreshing={refreshing}          <Text style={styles.logoutText}>Logout</Text>

            onRefresh={onRefresh}        </TouchableOpacity>

            colors={[COLORS.green]}      </View>

            tintColor={COLORS.green}

          />      {/* User Stats */}

        }      <View style={styles.statsContainer}>

      >        <View style={styles.statBox}>

        {/* Savings / Rewards band */}          <Text style={styles.statLabel}>Reward Points</Text>

        <View style={styles.section}>          <Text style={styles.statValue}>{user?.rewardPoints || 0}</Text>

          <BrandCard        </View>

            gradient={GRADIENTS.primary}        <View style={styles.statBox}>

            icon="🌿"          <Text style={styles.statLabel}>Mobile</Text>

            title={`${user?.rewardPoints || 0} Reward Points`}          <Text style={styles.statValue}>{user?.mobile}</Text>

            subtitle="Tap to redeem fresh savings"        </View>

            chip="SAVED ₹820"      </View>

            onPress={() => navigation.navigate("GardenScreen")}

          />      {/* Quick Actions */}

        </View>      <View style={styles.quickActionsContainer}>

        <TouchableOpacity

        {/* Start Your Journey + Flash Deal */}          style={styles.actionCard}

        <View style={styles.section}>          onPress={() => navigation.navigate("ShopScreen")}

          <BrandCard        >

            gradient={GRADIENTS.sun}          <Text style={styles.actionIcon}>🛒</Text>

            icon="🚀"          <Text style={styles.actionLabel}>Shop</Text>

            title="Start Your Journey"        </TouchableOpacity>

            subtitle="Begin with a starter kit"        <TouchableOpacity

            chip="Start →"          style={styles.actionCard}

            onPress={() => navigation.navigate("ShopScreen")}          onPress={() => navigation.navigate("CartScreen")}

            style={{ marginBottom: SPACING.sm }}        >

          />          <Text style={styles.actionIcon}>🛍️</Text>

          <BrandCard          <Text style={styles.actionLabel}>Cart</Text>

            gradient={GRADIENTS.harvest}        </TouchableOpacity>

            icon="⚡"        <TouchableOpacity

            title="Flash Deal · 30% off"          style={styles.actionCard}

            subtitle="Limited time on fresh saplings"          onPress={() => navigation.navigate("GardenScreen")}

            chip="Shop →"        >

            onPress={() => navigation.navigate("ShopScreen")}          <Text style={styles.actionIcon}>🌱</Text>

          />          <Text style={styles.actionLabel}>My Garden</Text>

        </View>        </TouchableOpacity>

        <TouchableOpacity

        {/* 5 Quick Actions */}          style={styles.actionCard}

        <View style={[styles.section, styles.qaRow]}>          onPress={() => navigation.navigate("Orders")}

          <QuickAction icon="🛒" label="Shop" onPress={() => navigation.navigate("ShopScreen")} />        >

          <QuickAction icon="🛍️" label="Cart" onPress={() => navigation.navigate("CartScreen")} />          <Text style={styles.actionIcon}>📦</Text>

          <QuickAction icon="🌱" label="Garden" onPress={() => navigation.navigate("GardenScreen")} />          <Text style={styles.actionLabel}>Orders</Text>

          <QuickAction icon="📦" label="Orders" onPress={() => navigation.navigate("Orders")} />        </TouchableOpacity>

          <QuickAction icon="✨" label="More" onPress={() => navigation.navigate("CommunityForumScreen")} />      </View>

        </View>

      {/* Categories Section */}

        {/* Categories */}      <View style={styles.sectionContainer}>

        <View style={styles.section}>        <Text style={styles.sectionTitle}>Categories</Text>

          <SectionHeader        <ScrollView horizontal showsHorizontalScrollIndicator={false}>

            title="Categories"          {categories.map((category, idx) => (

            linkLabel="See all"            <TouchableOpacity

            onLinkPress={() => navigation.navigate("ShopScreen")}              key={idx}

          />              style={styles.categoryChip}

          <ScrollView              onPress={() =>

            horizontal                navigation.navigate("ShopScreen", { category })

            showsHorizontalScrollIndicator={false}              }

            contentContainerStyle={{ paddingVertical: 4 }}            >

          >              <Text style={styles.categoryText}>{category}</Text>

            {categories.map((category, idx) => (            </TouchableOpacity>

              <TouchableOpacity          ))}

                key={idx}        </ScrollView>

                style={styles.chip}      </View>

                onPress={() => navigation.navigate("ShopScreen", { category })}

              >      {/* Featured Products */}

                <Text style={styles.chipText}>{category}</Text>      <View style={styles.sectionContainer}>

              </TouchableOpacity>        <View style={styles.sectionHeader}>

            ))}          <Text style={styles.sectionTitle}>Featured Products</Text>

          </ScrollView>          <TouchableOpacity

        </View>            onPress={() => navigation.navigate("ShopScreen")}

          >

        {/* Featured Products */}            <Text style={styles.viewAllText}>View All →</Text>

        <View style={styles.section}>          </TouchableOpacity>

          <SectionHeader        </View>

            title="Hyderabad Picks"

            linkLabel="View all"        <View style={styles.productsGrid}>

            onLinkPress={() => navigation.navigate("ShopScreen")}          {featuredProducts.map((product) => (

          />            <TouchableOpacity

          <View style={styles.grid}>              key={product._id}

            {featuredProducts.map((p) => (              style={styles.productCard}

              <TouchableOpacity              onPress={() =>

                key={p._id}                navigation.navigate("ShopScreen", { productId: product._id })

                style={styles.productCard}              }

                onPress={() => navigation.navigate("ShopScreen", { productId: p._id })}            >

                activeOpacity={0.85}              <View style={styles.productImage}>

              >                <Text style={styles.productImageText}>

                <View style={styles.productImg}>                  {product.category === "Seeds" ? "🌾" : product.category === "Saplings" ? "🌱" : product.category === "Minerals" ? "💪" : "📦"}

                  <Text style={{ fontSize: 36 }}>{iconFor(p.category)}</Text>                </Text>

                </View>              </View>

                <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>              <Text style={styles.productName}>{product.name}</Text>

                <Text style={styles.productCat} numberOfLines={1}>{p.category}</Text>              <Text style={styles.productCategory}>{product.category}</Text>

                <View style={styles.priceRow}>              <View style={styles.priceContainer}>

                  <Text style={styles.price}>₹{p.price}</Text>                <Text style={styles.price}>₹{product.price}</Text>

                </View>              </View>

                <TouchableOpacity              <TouchableOpacity

                  style={styles.addBtn}                style={styles.addToCartBtn}

                  onPress={() => {                onPress={() => {

                    Alert.alert("Added to Cart", `${p.name} added!`);                  Alert.alert("Added to Cart", `${product.name} added to cart!`);

                    navigation.navigate("CartScreen");                  navigation.navigate("CartScreen");

                  }}                }}

                >              >

                  <Text style={styles.addBtnText}>Add to Cart</Text>                <Text style={styles.addToCartText}>Add to Cart</Text>

                </TouchableOpacity>              </TouchableOpacity>

              </TouchableOpacity>            </TouchableOpacity>

            ))}          ))}

          </View>        </View>

        </View>      </View>



        {/* Smart Tip */}      {/* Tips Section */}

        <View style={styles.section}>      <View style={styles.tipsContainer}>

          <BrandCard        <Text style={styles.tipTitle}>💡 Daily Tip</Text>

            gradient={GRADIENTS.sky}        <Text style={styles.tipText}>

            icon="💧"          Water your plants early in the morning for best results. This helps prevent fungal infections and allows plants to absorb water before the sun gets too hot.

            title="Smart Tip"        </Text>

            subtitle="Water early morning to prevent fungus"      </View>

          />

        </View>      <View style={{ height: 20 }} />

      </ScrollView>    </ScrollView>

    </View>  );

  );}

}

const styles = StyleSheet.create({

const styles = StyleSheet.create({  container: {

  root: { flex: 1, backgroundColor: COLORS.bg },    flex: 1,

  scroll: { flex: 1 },    backgroundColor: colors.light

  center: {  },

    flex: 1,  centerContainer: {

    justifyContent: "center",    flex: 1,

    alignItems: "center",    justifyContent: "center",

    backgroundColor: COLORS.bg,    alignItems: "center",

  },    backgroundColor: colors.light

  headerLink: {  },

    color: COLORS.white,  header: {

    fontWeight: "700",    flexDirection: "row",

    fontSize: 13,    justifyContent: "space-between",

  },    alignItems: "center",

  section: {    paddingHorizontal: 16,

    paddingHorizontal: SPACING.lg,    paddingTop: 20,

    marginTop: SPACING.lg,    paddingBottom: 16

  },  },

  qaRow: {  welcomeText: {

    flexDirection: "row",    fontSize: 14,

    gap: SPACING.sm,    color: "#666"

  },  },

  chip: {  userName: {

    backgroundColor: COLORS.white,    fontSize: 24,

    borderRadius: RADIUS.pill,    fontWeight: "bold",

    paddingHorizontal: SPACING.md,    color: colors.text

    paddingVertical: 8,  },

    marginRight: SPACING.sm,  logoutBtn: {

    borderWidth: 1,    backgroundColor: "#FF6B6B",

    borderColor: COLORS.greenPale,    paddingHorizontal: 12,

    ...SHADOWS.sm,    paddingVertical: 6,

  },    borderRadius: 6

  chipText: {  },

    color: COLORS.green,  logoutText: {

    fontWeight: "700",    color: colors.white,

    fontSize: 12,    fontSize: 12,

  },    fontWeight: "600"

  grid: {  },

    flexDirection: "row",  statsContainer: {

    flexWrap: "wrap",    flexDirection: "row",

    justifyContent: "space-between",    paddingHorizontal: 16,

    marginTop: SPACING.sm,    marginBottom: 16,

    gap: SPACING.sm,    gap: 12

  },  },

  productCard: {  statBox: {

    width: "48%",    flex: 1,

    backgroundColor: COLORS.white,    backgroundColor: colors.white,

    borderRadius: RADIUS.md,    borderRadius: 10,

    padding: SPACING.sm,    padding: 12,

    ...SHADOWS.sm,    alignItems: "center"

  },  },

  productImg: {  statLabel: {

    height: 84,    fontSize: 12,

    backgroundColor: COLORS.greenPale,    color: "#999",

    borderRadius: RADIUS.sm,    marginBottom: 4

    justifyContent: "center",  },

    alignItems: "center",  statValue: {

    marginBottom: SPACING.sm,    fontSize: 20,

  },    fontWeight: "bold",

  productName: {    color: colors.primary

    ...TYPE.card,  },

    color: COLORS.text,  quickActionsContainer: {

    marginBottom: 2,    flexDirection: "row",

  },    flexWrap: "wrap",

  productCat: {    paddingHorizontal: 12,

    ...TYPE.caption,    marginBottom: 20,

    color: COLORS.muted,    gap: 8

    marginBottom: 6,  },

  },  actionCard: {

  priceRow: { marginBottom: 6 },    width: "23%",

  price: {    backgroundColor: colors.white,

    fontSize: 14,    borderRadius: 10,

    fontWeight: "800",    padding: 12,

    color: COLORS.green,    alignItems: "center",

  },    justifyContent: "center",

  addBtn: {    borderWidth: 1,

    backgroundColor: COLORS.green,    borderColor: "#E0E0E0"

    borderRadius: RADIUS.sm,  },

    paddingVertical: 7,  actionIcon: {

    alignItems: "center",    fontSize: 24,

  },    marginBottom: 4

  addBtnText: {  },

    color: COLORS.white,  actionLabel: {

    fontSize: 11,    fontSize: 11,

    fontWeight: "800",    fontWeight: "600",

    letterSpacing: 0.3,    color: colors.text,

  },    textAlign: "center"

});  },

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
