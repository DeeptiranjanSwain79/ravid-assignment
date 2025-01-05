import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import {
  initPaymentSheet,
  presentPaymentSheet,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import {
  calculateCartTotal,
  clearCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} from "@/utils/cart.utils";
import axios from "axios";
import { PrivateAPI } from "@/utils/axios-client";
import { useFocusEffect } from "expo-router";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();

  const fetchCartData = useCallback(async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
      const total = await calculateCartTotal();
      setTotalPrice(total);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, []);

  useFocusEffect(() => {
    fetchCartData();
  });

  const handleQuantityUpdate = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      Alert.alert("Invalid Quantity", "Quantity should be at least 1.");
      return;
    }
    await updateCartQuantity(productId, quantity);
    fetchCartData();
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
    Toast.show("Item removed from cart.", { type: "success" });
    fetchCartData();
  };

  const handleCheckout = async () => {
    if (!cartItems.length) {
      Alert.alert("Error", "Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await PrivateAPI.post("/orders/payment-intent", {
        items: cartItems,
        total: totalPrice,
      });

      if (!data.clientSecret) {
        Alert.alert("Error", "Unable to process payment.");
        setLoading(false);
        return;
      }

      const initSheetResponse = await initPaymentSheet({
        merchantDisplayName: "RAVID Assignment",
        paymentIntentClientSecret: data.clientSecret,
        returnURL: "exp://(tabs)/",
      });

      if (initSheetResponse.error) {
        console.error(initSheetResponse.error);
        return;
      }

      const paymentResponse = await presentPaymentSheet();

      if (paymentResponse.error) {
        console.error(paymentResponse.error);
        Toast.show(paymentResponse.error.message, {
          type: "danger",
        });
        throw new Error(paymentResponse.error.message);
      }

      const { status } = await PrivateAPI.post("/orders/confirm", {
        items: cartItems,
        total: totalPrice,
      });

      if (status === 201) {
        Toast.show("Order placed successfully!", { type: "success" });
        setCartItems([]);
        clearCart();
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityUpdate(item.product, item.quantity - 1)
            }
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityUpdate(item.product, item.quantity + 1)
            }
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemoveItem(item.product)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <StripeProvider publishableKey="pk_test_51LUVg8SJg6C6AJ2flgbg37CNZ9nXcXgSvQlxzOdjQWxpKyvbaeAE422hs1WucdczuuUwRvFo97qTw5PZVSXsW36800MDobzCLO">
      <View style={styles.container}>
        <Text style={styles.header}>Your Cart</Text>
        {cartItems.length > 0 ? (
          <>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item: any) => item.product}
              contentContainerStyle={styles.listContainer}
            />
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        )}
      </View>
    </StripeProvider>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#ff4d4d",
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#555",
    marginTop: 20,
  },
});
