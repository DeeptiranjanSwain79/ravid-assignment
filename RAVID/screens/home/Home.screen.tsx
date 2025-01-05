import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { PrivateAPI } from "@/utils/axios-client";
import { Toast } from "react-native-toast-notifications";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { RelativePathString, router } from "expo-router";

const HomeScreen = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllProducts = useCallback(async () => {
    try {
      const { status, data } = await PrivateAPI.get("/users/products");
      if (status === 200 && data) {
        setAllProducts(data.products);
      }
    } catch (error: any) {
      Toast.show(error?.response?.data?.message || error.message, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllProducts();
  }, []);

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(routes)/product-details" as RelativePathString,
          params: { data: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={{ uri: item?.image! }}
        style={styles.productImage}
        onError={(error) =>
          console.log("Image Load Error:", error.nativeEvent.error)
        }
      />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {allProducts.length > 0 ? (
        <FlatList
          data={allProducts}
          renderItem={renderProduct}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.emptyText}>No products available.</Text>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: widthPercentageToDP(86),
    height: 180,
    borderRadius: 5,
    alignSelf: "center",
    resizeMode: "cover",
    backgroundColor: "#eaeaea", // Placeholder background
  },
  cardContent: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
});
