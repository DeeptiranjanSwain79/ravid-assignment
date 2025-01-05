import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useUser from "@/hooks/auth/useUser";
import { addToCart } from "@/utils/cart.utils";

const ProductDetailsScreen = () => {
  const { data }: any = useLocalSearchParams();
  const { user, loading } = useUser();

  const product: any = JSON.parse(data);
  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product details not available!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Product Image */}
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
        resizeMode="cover"
      />

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>₹{product.price}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => addToCart(product, 1)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => router.push("/(tabs)/cart")}
        >
          <Text style={styles.buyNowText}>Go to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* User Info (Optional) */}
      {!loading && user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>
            Logged in as: {user?.name || "Guest"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 550,
    borderRadius: 10,
    marginBottom: 16,
    objectFit: "cover",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: "#888",
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#ffa726",
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#43a047",
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buyNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfoContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoText: {
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
});
