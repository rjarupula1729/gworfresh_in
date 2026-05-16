import React, { useState, useEffect, useContext } from "react";import React, { useState, useEffect, useContext } from "react";

import {import {

  View,  View,

  Text,  Text,

  ScrollView,  ScrollView,

  TouchableOpacity,  TouchableOpacity,

  StyleSheet,  StyleSheet,

  ActivityIndicator,  ActivityIndicator,

  Alert,  Alert,

  FlatList,  FlatList,

  TextInput,  TextInput,

  Image,  Image

} from "react-native";} from "react-native";

import API from "../services/api";import API from "../services/api";

import { AppContext } from "../context/AppContext";import { AppContext } from "../context/AppContext";

import { COLORS, GRADIENTS } from "../utils/colors";import colors from "../utils/colors";

import { SPACING, RADIUS, SHADOWS, TYPE } from "../utils/theme";

import ScreenHeader from "../components/ScreenHeader";export default function ShopScreen({ navigation, route }) {

import SectionHeader from "../components/SectionHeader";  const { setCart, cart } = useContext(AppContext);

import EmptyState from "../components/EmptyState";  const [products, setProducts] = useState([]);

import InfoChip from "../components/InfoChip";  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);

const iconFor = (cat) =>  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || null);

  cat === "Seeds" ? "🌾" : cat === "Saplings" ? "🌱" : cat === "Minerals" ? "💪" : "📦";  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);

export default function ShopScreen({ navigation, route }) {  const [selectedProduct, setSelectedProduct] = useState(null);

  const { setCart, cart } = useContext(AppContext);  const [quantity, setQuantity] = useState(1);

  const [products, setProducts] = useState([]);

  const [filtered, setFiltered] = useState([]);  useEffect(() => {

  const [categories, setCategories] = useState([]);    fetchData();

  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || null);  }, []);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);  useEffect(() => {

  const [selectedProduct, setSelectedProduct] = useState(null);    filterProducts();

  const [quantity, setQuantity] = useState(1);  }, [selectedCategory, searchText, products]);



  useEffect(() => {  const fetchData = async () => {

    (async () => {    try {

      try {      const categoriesRes = await API.get("/products/categories/list");

        const [c, p] = await Promise.all([      setCategories(categoriesRes.data);

          API.get("/products/categories/list"),

          API.get("/products"),      const productsRes = await API.get("/products");

        ]);      setProducts(productsRes.data);

        setCategories(c.data || []);      setFilteredProducts(productsRes.data);

        setProducts(p.data || []);    } catch (err) {

        setFiltered(p.data || []);      Alert.alert("Error", "Failed to load products");

      } catch (e) {    } finally {

        Alert.alert("Error", "Failed to load products");      setLoading(false);

      } finally {    }

        setLoading(false);  };

      }

    })();  const filterProducts = () => {

  }, []);    let filtered = products;



  useEffect(() => {    if (selectedCategory) {

    let f = products;      filtered = filtered.filter(p => p.category === selectedCategory);

    if (selectedCategory) f = f.filter((p) => p.category === selectedCategory);    }

    if (searchText) {

      const q = searchText.toLowerCase();    if (searchText) {

      f = f.filter((p) => p.name.toLowerCase().includes(q));      filtered = filtered.filter(p =>

    }        p.name.toLowerCase().includes(searchText.toLowerCase())

    setFiltered(f);      );

  }, [selectedCategory, searchText, products]);    }



  const handleAddToCart = (product, qty = 1) => {    setFilteredProducts(filtered);

    const existing = cart.find((i) => i.productId === product._id);  };

    const newCart = existing

      ? cart.map((i) =>  const handleAddToCart = (product) => {

          i.productId === product._id ? { ...i, quantity: i.quantity + qty } : i    const existingItem = cart.find(item => item.productId === product._id);

        )

      : [    const newCart = existingItem

          ...cart,      ? cart.map(item =>

          {          item.productId === product._id

            productId: product._id,            ? { ...item, quantity: item.quantity + quantity }

            name: product.name,            : item

            price: product.price,        )

            quantity: qty,      : [

          },          ...cart,

        ];          {

    setCart(newCart);            productId: product._id,

    Alert.alert("Added", `${qty} × ${product.name} added to cart!`);            name: product.name,

    setSelectedProduct(null);            price: product.price,

    setQuantity(1);            quantity

  };          }

        ];

  if (loading) {

    return (    setCart(newCart);

      <View style={styles.center}>    Alert.alert("Success", `${quantity} x ${product.name} added to cart!`);

        <ActivityIndicator size="large" color={COLORS.green} />    setSelectedProduct(null);

      </View>    setQuantity(1);

    );  };

  }

  if (loading) {

  // ---------- Product Details ----------    return (

  if (selectedProduct) {      <View style={styles.centerContainer}>

    const p = selectedProduct;        <ActivityIndicator size="large" color={colors.primary} />

    return (      </View>

      <View style={styles.root}>    );

        <ScreenHeader title="Product Details" onBack={() => setSelectedProduct(null)} />  }

        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>

          <View style={styles.detailImageWrap}>  if (selectedProduct) {

            {p.image ? (    return (

              <Image source={{ uri: p.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />      <View style={styles.container}>

            ) : (        <View style={styles.detailsHeader}>

              <Text style={{ fontSize: 96 }}>{iconFor(p.category)}</Text>          <TouchableOpacity onPress={() => setSelectedProduct(null)}>

            )}            <Text style={styles.backButton}>← Back</Text>

          </View>          </TouchableOpacity>

          <Text style={styles.detailsTitle}>Product Details</Text>

          <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg }}>          <View style={{ width: 50 }} />

            <InfoChip variant="green" label={p.category} />        </View>

            <Text style={styles.detailName}>{p.name}</Text>

        <ScrollView style={styles.detailsContainer}>

            <View style={styles.priceBlock}>          <View style={styles.detailsImageContainer}>

              <Text style={styles.priceLabel}>Price</Text>            {selectedProduct.image ? (

              <Text style={styles.priceValue}>₹{p.price}</Text>              <Image

            </View>                source={{ uri: selectedProduct.image }}

                style={styles.detailsProductImage}

            <SectionHeader title="Description" />                defaultSource={require("../assets/placeholder.png")}

            <Text style={styles.detailDesc}>                resizeMode="cover"

              {p.description ||              />

                "Premium quality product for your garden. Carefully selected and tested for best results."}            ) : (

            </Text>              <Text style={styles.detailsImageText}>

                {selectedProduct.category === "Seeds" ? "🌾" : selectedProduct.category === "Saplings" ? "🌱" : selectedProduct.category === "Minerals" ? "💪" : "📦"}

            <SectionHeader title="Care Instructions" />              </Text>

            <Text style={styles.detailDesc}>            )}

              {p.instructions || "• Water regularly\n• Place in sunlight\n• Maintain soil moisture\n• Check for pests weekly"}          </View>

            </Text>

          <View style={styles.detailsContent}>

            <SectionHeader title="Stock" />            <Text style={styles.detailsName}>{selectedProduct.name}</Text>

            <Text style={styles.stockText}>            <Text style={styles.detailsCategory}>{selectedProduct.category}</Text>

              {p.stock > 0 ? `${p.stock} units available` : "Out of stock"}

            </Text>            <View style={styles.detailsPrice}>

              <Text style={styles.detailsPriceLabel}>Price</Text>

            {p.stock > 0 && (              <Text style={styles.detailsPriceValue}>₹{selectedProduct.price}</Text>

              <>            </View>

                <View style={styles.qtyRow}>

                  <Text style={styles.qtyLabel}>Quantity</Text>            <Text style={styles.detailsSectionTitle}>Description</Text>

                  <View style={styles.qtyControl}>            <Text style={styles.detailsDescription}>

                    <TouchableOpacity              {selectedProduct.description || "Premium quality product for your garden. Carefully selected and tested for best results."}

                      style={styles.qtyBtn}            </Text>

                      onPress={() => setQuantity(Math.max(1, quantity - 1))}

                    >            <Text style={styles.detailsSectionTitle}>Care Instructions</Text>

                      <Text style={styles.qtyBtnText}>−</Text>            <Text style={styles.detailsInstructions}>

                    </TouchableOpacity>              {selectedProduct.instructions || "• Water regularly\n• Place in sunlight\n• Maintain soil moisture\n• Check for pests weekly"}

                    <Text style={styles.qtyValue}>{quantity}</Text>            </Text>

                    <TouchableOpacity

                      style={styles.qtyBtn}            <Text style={styles.detailsSectionTitle}>Stock Available</Text>

                      onPress={() => setQuantity(quantity + 1)}            <Text style={styles.stockText}>

                    >              {selectedProduct.stock} units available

                      <Text style={styles.qtyBtnText}>+</Text>            </Text>

                    </TouchableOpacity>

                  </View>            {selectedProduct.stock > 0 && (

                </View>              <>

                <View style={styles.quantityContainer}>

                <TouchableOpacity                  <Text style={styles.quantityLabel}>Quantity</Text>

                  style={styles.bigAddBtn}                  <View style={styles.quantityControl}>

                  onPress={() => handleAddToCart(p, quantity)}                    <TouchableOpacity

                  activeOpacity={0.85}                      style={styles.quantityBtn}

                >                      onPress={() => setQuantity(Math.max(1, quantity - 1))}

                  <Text style={styles.bigAddBtnText}>Add to Cart · ₹{p.price * quantity}</Text>                    >

                </TouchableOpacity>                      <Text style={styles.quantityBtnText}>−</Text>

              </>                    </TouchableOpacity>

            )}                    <Text style={styles.quantityValue}>{quantity}</Text>

          </View>                    <TouchableOpacity

        </ScrollView>                      style={styles.quantityBtn}

      </View>                      onPress={() => setQuantity(quantity + 1)}

    );                    >

  }                      <Text style={styles.quantityBtnText}>+</Text>

                    </TouchableOpacity>

  // ---------- Shop List ----------                  </View>

  return (                </View>

    <View style={styles.root}>

      <ScreenHeader                <TouchableOpacity

        title="Shop"                  style={styles.addToCartButton}

        right={                  onPress={() => handleAddToCart(selectedProduct)}

          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")} hitSlop={10}>                >

            <Text style={styles.headerCart}>🛍️ {cart.length}</Text>                  <Text style={styles.addToCartButtonText}>Add to Cart</Text>

          </TouchableOpacity>                </TouchableOpacity>

        }              </>

      />            )}

          </View>

      <View style={styles.searchWrap}>        </ScrollView>

        <Text style={styles.searchIcon}>🔍</Text>      </View>

        <TextInput    );

          style={styles.searchInput}  }

          placeholder="Search seeds, saplings…"

          placeholderTextColor={COLORS.muted}  return (

          value={searchText}    <View style={styles.container}>

          onChangeText={setSearchText}      <View style={styles.header}>

        />        <Text style={styles.headerTitle}>Shop</Text>

      </View>        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>

          <Text style={styles.cartIcon}>🛍️ {cart.length}</Text>

      <ScrollView        </TouchableOpacity>

        horizontal      </View>

        showsHorizontalScrollIndicator={false}

        style={styles.chipsScroll}      <View style={styles.searchContainer}>

        contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm }}        <TextInput

      >          style={styles.searchInput}

        <CategoryPill label="All" active={!selectedCategory} onPress={() => setSelectedCategory(null)} />          placeholder="Search products..."

        {categories.map((c, i) => (          value={searchText}

          <CategoryPill          onChangeText={setSearchText}

            key={i}        />

            label={c}      </View>

            active={selectedCategory === c}

            onPress={() => setSelectedCategory(c)}      <ScrollView

          />        horizontal

        ))}        showsHorizontalScrollIndicator={false}

      </ScrollView>        style={styles.categoriesScroll}

      >

      {filtered.length === 0 ? (        <TouchableOpacity

        <EmptyState          style={[

          icon="🔎"            styles.categoryFilter,

          title="No products found"            !selectedCategory && styles.categoryFilterActive

          subtitle="Try a different search or category"          ]}

        />          onPress={() => setSelectedCategory(null)}

      ) : (        >

        <FlatList          <Text

          data={filtered}            style={[

          keyExtractor={(item) => item._id}              styles.categoryFilterText,

          numColumns={2}              !selectedCategory && styles.categoryFilterTextActive

          columnWrapperStyle={styles.colWrap}            ]}

          contentContainerStyle={{ paddingBottom: 24 }}          >

          renderItem={({ item }) => (            All

            <TouchableOpacity          </Text>

              style={styles.card}        </TouchableOpacity>

              onPress={() => setSelectedProduct(item)}

              activeOpacity={0.85}        {categories.map((category, idx) => (

            >          <TouchableOpacity

              <View style={styles.cardImg}>            key={idx}

                {item.image ? (            style={[

                  <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />              styles.categoryFilter,

                ) : (              selectedCategory === category && styles.categoryFilterActive

                  <Text style={{ fontSize: 42 }}>{iconFor(item.category)}</Text>            ]}

                )}            onPress={() => setSelectedCategory(category)}

              </View>          >

              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>            <Text

              <Text style={styles.cardCat} numberOfLines={1}>{item.category}</Text>              style={[

              <View style={styles.cardPriceRow}>                styles.categoryFilterText,

                <Text style={styles.cardPrice}>₹{item.price}</Text>                selectedCategory === category &&

              </View>                  styles.categoryFilterTextActive

              <TouchableOpacity              ]}

                style={styles.cardAdd}            >

                onPress={() => handleAddToCart(item, 1)}              {category}

              >            </Text>

                <Text style={styles.cardAddText}>Add</Text>          </TouchableOpacity>

              </TouchableOpacity>        ))}

            </TouchableOpacity>      </ScrollView>

          )}

        />      {filteredProducts.length === 0 ? (

      )}        <View style={styles.emptyContainer}>

    </View>          <Text style={styles.emptyText}>No products found</Text>

  );        </View>

}      ) : (

        <FlatList

function CategoryPill({ label, active, onPress }) {          data={filteredProducts}

  return (          keyExtractor={(item) => item._id}

    <TouchableOpacity          numColumns={2}

      onPress={onPress}          columnWrapperStyle={styles.columnWrapper}

      style={[styles.catPill, active && styles.catPillActive]}          renderItem={({ item }) => (

      activeOpacity={0.85}            <TouchableOpacity

    >              style={styles.productCard}

      <Text style={[styles.catPillText, active && styles.catPillTextActive]}>{label}</Text>              onPress={() => setSelectedProduct(item)}

    </TouchableOpacity>            >

  );              <View style={styles.productImage}>

}                {item.image ? (

                  <Image

const styles = StyleSheet.create({                    source={{ uri: item.image }}

  root: { flex: 1, backgroundColor: COLORS.bg },                    style={styles.productImageContent}

  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },                    resizeMode="cover"

  headerCart: { color: COLORS.white, fontWeight: "800", fontSize: 13 },                  />

                ) : (

  searchWrap: {                  <Text style={styles.productImageText}>

    flexDirection: "row",                    {item.category === "Seeds" ? "🌾" : item.category === "Saplings" ? "🌱" : item.category === "Minerals" ? "💪" : "📦"}

    alignItems: "center",                  </Text>

    marginHorizontal: SPACING.lg,                )}

    marginTop: SPACING.lg,              </View>

    backgroundColor: COLORS.white,              <Text style={styles.productName}>{item.name}</Text>

    borderRadius: RADIUS.pill,              <Text style={styles.productCategory}>{item.category}</Text>

    paddingHorizontal: SPACING.md,              <Text style={styles.productPrice}>₹{item.price}</Text>

    borderWidth: 1,              <TouchableOpacity

    borderColor: COLORS.border,                style={styles.quickAddBtn}

    ...SHADOWS.sm,                onPress={() => {

  },                  setSelectedProduct(item);

  searchIcon: { fontSize: 14, marginRight: 6 },                }}

  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: COLORS.text },              >

                <Text style={styles.quickAddBtnText}>View & Add</Text>

  chipsScroll: { marginTop: SPACING.md, marginBottom: SPACING.sm, flexGrow: 0 },              </TouchableOpacity>

  catPill: {            </TouchableOpacity>

    backgroundColor: COLORS.white,          )}

    borderRadius: RADIUS.pill,          scrollEnabled={false}

    paddingHorizontal: SPACING.md,        />

    paddingVertical: 7,      )}

    borderWidth: 1,    </View>

    borderColor: COLORS.border,  );

  },}

  catPillActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },

  catPillText: { fontSize: 12, fontWeight: "700", color: COLORS.muted },const styles = StyleSheet.create({

  catPillTextActive: { color: COLORS.white },  container: {

    flex: 1,

  colWrap: { justifyContent: "space-between", paddingHorizontal: SPACING.lg, marginTop: SPACING.sm, gap: SPACING.sm },    backgroundColor: colors.light

  card: {  },

    width: "48%",  centerContainer: {

    backgroundColor: COLORS.white,    flex: 1,

    borderRadius: RADIUS.md,    justifyContent: "center",

    padding: SPACING.sm,    alignItems: "center",

    marginBottom: SPACING.sm,    backgroundColor: colors.light

    ...SHADOWS.sm,  },

  },  header: {

  cardImg: {    flexDirection: "row",

    height: 100,    justifyContent: "space-between",

    backgroundColor: COLORS.greenPale,    alignItems: "center",

    borderRadius: RADIUS.sm,    paddingHorizontal: 16,

    justifyContent: "center",    paddingTop: 12,

    alignItems: "center",    paddingBottom: 12,

    marginBottom: 8,    backgroundColor: colors.white,

    overflow: "hidden",    borderBottomWidth: 1,

  },    borderBottomColor: "#EEE"

  cardName: { ...TYPE.card, color: COLORS.text },  },

  cardCat: { ...TYPE.caption, color: COLORS.muted, marginTop: 2 },  headerTitle: {

  cardPriceRow: { marginVertical: 6 },    fontSize: 20,

  cardPrice: { fontSize: 14, fontWeight: "800", color: COLORS.green },    fontWeight: "bold",

  cardAdd: {    color: colors.text

    backgroundColor: COLORS.green,  },

    borderRadius: RADIUS.sm,  cartIcon: {

    paddingVertical: 7,    fontSize: 14,

    alignItems: "center",    fontWeight: "600",

  },    color: colors.primary

  cardAddText: { color: COLORS.white, fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },  },

  searchContainer: {

  // Detail    paddingHorizontal: 16,

  detailImageWrap: {    paddingVertical: 12

    height: 220,  },

    backgroundColor: COLORS.greenPale,  searchInput: {

    justifyContent: "center",    backgroundColor: colors.white,

    alignItems: "center",    borderRadius: 20,

    overflow: "hidden",    paddingHorizontal: 14,

  },    paddingVertical: 10,

  detailName: { ...TYPE.hero, color: COLORS.text, marginTop: SPACING.sm, marginBottom: 4 },    borderWidth: 1,

  priceBlock: {    borderColor: "#DDD",

    backgroundColor: COLORS.white,    fontSize: 14

    borderRadius: RADIUS.md,  },

    padding: SPACING.md,  categoriesScroll: {

    marginTop: SPACING.md,    paddingHorizontal: 16,

    flexDirection: "row",    paddingBottom: 12

    justifyContent: "space-between",  },

    alignItems: "center",  categoryFilter: {

    ...SHADOWS.sm,    backgroundColor: colors.white,

  },    borderRadius: 20,

  priceLabel: { ...TYPE.caption, color: COLORS.muted },    paddingHorizontal: 14,

  priceValue: { fontSize: 22, fontWeight: "900", color: COLORS.green },    paddingVertical: 8,

  detailDesc: { ...TYPE.body, color: COLORS.text, lineHeight: 20, marginBottom: 4 },    marginRight: 8,

  stockText: { ...TYPE.body, color: COLORS.greenDeep, fontWeight: "700" },    borderWidth: 1,

    borderColor: "#DDD"

  qtyRow: {  },

    flexDirection: "row",  categoryFilterActive: {

    alignItems: "center",    backgroundColor: colors.primary,

    justifyContent: "space-between",    borderColor: colors.primary

    marginTop: SPACING.lg,  },

    backgroundColor: COLORS.white,  categoryFilterText: {

    borderRadius: RADIUS.md,    fontSize: 12,

    padding: SPACING.md,    fontWeight: "500",

    ...SHADOWS.sm,    color: "#666"

  },  },

  qtyLabel: { ...TYPE.card, color: COLORS.text },  categoryFilterTextActive: {

  qtyControl: { flexDirection: "row", alignItems: "center" },    color: colors.white

  qtyBtn: {  },

    width: 36,  emptyContainer: {

    height: 36,    flex: 1,

    borderRadius: RADIUS.sm,    justifyContent: "center",

    backgroundColor: COLORS.greenPale,    alignItems: "center"

    justifyContent: "center",  },

    alignItems: "center",  emptyText: {

  },    fontSize: 14,

  qtyBtnText: { fontSize: 18, fontWeight: "900", color: COLORS.green },    color: "#999"

  qtyValue: { fontSize: 16, fontWeight: "800", marginHorizontal: SPACING.lg, color: COLORS.text },  },

  columnWrapper: {

  bigAddBtn: {    justifyContent: "space-between",

    marginTop: SPACING.lg,    paddingHorizontal: 16,

    backgroundColor: COLORS.green,    marginBottom: 12

    borderRadius: RADIUS.sm,  },

    paddingVertical: 14,  productCard: {

    alignItems: "center",    width: "48%",

    ...SHADOWS.md,    backgroundColor: colors.white,

  },    borderRadius: 10,

  bigAddBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 15, letterSpacing: 0.4 },    padding: 10,

});    overflow: "hidden"

  },
  productImage: {
    height: 100,
    backgroundColor: colors.light,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden"
  },
  productImageContent: {
    width: "100%",
    height: "100%"
  },
  productImageText: {
    fontSize: 40
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
    marginBottom: 4
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 6
  },
  quickAddBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center"
  },
  quickAddBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600"
  },

  // Product Details Styles
  detailsHeader: {
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
  detailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text
  },
  detailsContainer: {
    flex: 1
  },
  detailsImageContainer: {
    height: 200,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden"
  },
  detailsProductImage: {
    width: "100%",
    height: "100%"
  },
  detailsImageText: {
    fontSize: 80
  },
  detailsContent: {
    paddingHorizontal: 16,
    paddingBottom: 20
  },
  detailsName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4
  },
  detailsCategory: {
    fontSize: 13,
    color: "#999",
    marginBottom: 12
  },
  detailsPrice: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  detailsPriceLabel: {
    fontSize: 12,
    color: "#999"
  },
  detailsPriceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary
  },
  detailsSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 14,
    marginBottom: 8
  },
  detailsDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  detailsInstructions: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  stockText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 10
  },
  quantityContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    marginBottom: 14
  },
  quantityLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  quantityBtn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  quantityBtnText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "bold"
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginHorizontal: 20
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20
  },
  addToCartButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold"
  }
});
