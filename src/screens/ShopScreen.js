import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  TextInput,
  Image
} from "react-native";
import API from "../services/api";
import { AppContext } from "../context/AppContext";
import colors from "../utils/colors";

export default function ShopScreen({ navigation, route }) {
  const { setCart, cart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchText, products]);

  const fetchData = async () => {
    try {
      const categoriesRes = await API.get("/products/categories/list");
      setCategories(categoriesRes.data);

      const productsRes = await API.get("/products");
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchText) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product._id);
    
    const newCart = existingItem
      ? cart.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [
          ...cart,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity
          }
        ];

    setCart(newCart);
    Alert.alert("Success", `${quantity} x ${product.name} added to cart!`);
    setSelectedProduct(null);
    setQuantity(1);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (selectedProduct) {
    return (
      <View style={styles.container}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity onPress={() => setSelectedProduct(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailsTitle}>Product Details</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.detailsContainer}>
          <View style={styles.detailsImageContainer}>
            {selectedProduct.image ? (
              <Image
                source={{ uri: selectedProduct.image }}
                style={styles.detailsProductImage}
                defaultSource={require("../assets/placeholder.png")}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.detailsImageText}>
                {selectedProduct.category === "Seeds" ? "🌾" : selectedProduct.category === "Saplings" ? "🌱" : selectedProduct.category === "Minerals" ? "💪" : "📦"}
              </Text>
            )}
          </View>

          <View style={styles.detailsContent}>
            <Text style={styles.detailsName}>{selectedProduct.name}</Text>
            <Text style={styles.detailsCategory}>{selectedProduct.category}</Text>
            
            <View style={styles.detailsPrice}>
              <Text style={styles.detailsPriceLabel}>Price</Text>
              <Text style={styles.detailsPriceValue}>₹{selectedProduct.price}</Text>
            </View>

            <Text style={styles.detailsSectionTitle}>Description</Text>
            <Text style={styles.detailsDescription}>
              {selectedProduct.description || "Premium quality product for your garden. Carefully selected and tested for best results."}
            </Text>

            <Text style={styles.detailsSectionTitle}>Care Instructions</Text>
            <Text style={styles.detailsInstructions}>
              {selectedProduct.instructions || "• Water regularly\n• Place in sunlight\n• Maintain soil moisture\n• Check for pests weekly"}
            </Text>

            <Text style={styles.detailsSectionTitle}>Stock Available</Text>
            <Text style={styles.stockText}>
              {selectedProduct.stock} units available
            </Text>

            {selectedProduct.stock > 0 && (
              <>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity</Text>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Text style={styles.quantityBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => setQuantity(quantity + 1)}
                    >
                      <Text style={styles.quantityBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(selectedProduct)}
                >
                  <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <Text style={styles.cartIcon}>🛍️ {cart.length}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        <TouchableOpacity
          style={[
            styles.categoryFilter,
            !selectedCategory && styles.categoryFilterActive
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryFilterText,
              !selectedCategory && styles.categoryFilterTextActive
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.categoryFilter,
              selectedCategory === category && styles.categoryFilterActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryFilterText,
                selectedCategory === category &&
                  styles.categoryFilterTextActive
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => setSelectedProduct(item)}
            >
              <View style={styles.productImage}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImageContent}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.productImageText}>
                    {item.category === "Seeds" ? "🌾" : item.category === "Saplings" ? "🌱" : item.category === "Minerals" ? "💪" : "📦"}
                  </Text>
                )}
              </View>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              <TouchableOpacity
                style={styles.quickAddBtn}
                onPress={() => {
                  setSelectedProduct(item);
                }}
              >
                <Text style={styles.quickAddBtnText}>View & Add</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      )}
    </View>
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
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text
  },
  cartIcon: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 14
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  categoryFilter: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#DDD"
  },
  categoryFilterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryFilterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666"
  },
  categoryFilterTextActive: {
    color: colors.white
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    fontSize: 14,
    color: "#999"
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12
  },
  productCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    overflow: "hidden"
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
