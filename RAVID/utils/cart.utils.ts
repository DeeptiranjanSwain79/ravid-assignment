import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

// Function to add or update an item in the cart
export const addToCart = async (product: any, quantity: number) => {
    try {
        const cartItemsStr = (await AsyncStorage.getItem("cart")) || "[]"; // Fallback to an empty array
        const cartItems = JSON.parse(cartItemsStr);

        // Check if the product is already in the cart
        const existingItemIndex = cartItems.findIndex((item: any) => item.product === product._id);

        if (existingItemIndex >= 0) {
            // Update the quantity of the existing item
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            // Add new product to the cart
            const cartItem = {
                name: product.name,
                quantity,
                price: product.price,
                image: product.image,
                product: product._id,
            };
            cartItems.push(cartItem);
        }

        // Save the updated cart to AsyncStorage
        await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
        Toast.show("Product added to cart. You can update the quantity in the cart page.", { type: "success" });
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
};

// Function to remove an item from the cart
export const removeFromCart = async (productId: string) => {
    try {
        const cartItemsStr = (await AsyncStorage.getItem("cart")) || "[]"; // Fallback to an empty array
        const cartItems = JSON.parse(cartItemsStr);

        // Filter out the item to be removed
        const updatedCart = cartItems.filter((item: any) => item.product !== productId);

        // Save the updated cart to AsyncStorage
        await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
        console.error("Error removing product from cart:", error);
    }
};

// Function to update the quantity of an item in the cart
export const updateCartQuantity = async (productId: string, quantity: number) => {
    try {
        const cartItemsStr = (await AsyncStorage.getItem("cart")) || "[]"; // Fallback to an empty array
        const cartItems = JSON.parse(cartItemsStr);

        // Update the quantity for the specific product
        const updatedCart = cartItems.map((item: any) => {
            if (item.product === productId) {
                return { ...item, quantity };
            }
            return item;
        });

        // Save the updated cart to AsyncStorage
        await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
        console.error("Error updating product quantity:", error);
    }
};

// Function to retrieve all items in the cart
export const getCartItems = async () => {
    try {
        const cartItemsStr = (await AsyncStorage.getItem("cart")) || "[]"; // Fallback to an empty array
        return JSON.parse(cartItemsStr);
    } catch (error) {
        console.error("Error retrieving cart items:", error);
        return [];
    }
};

// Function to clear the entire cart
export const clearCart = async () => {
    try {
        await AsyncStorage.removeItem("cart");
    } catch (error) {
        console.error("Error clearing cart:", error);
    }
};

// Function to calculate the total price of the cart
export const calculateCartTotal = async () => {
    try {
        const cartItems = await getCartItems();
        return cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    } catch (error) {
        console.error("Error calculating cart total:", error);
        return 0;
    }
};
