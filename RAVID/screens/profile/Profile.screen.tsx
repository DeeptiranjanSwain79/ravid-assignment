import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import useUser from "@/hooks/auth/useUser";
import { PrivateAPI } from "@/utils/axios-client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Loader from "@/components/loader/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
// 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
const ProfileScreen = () => {
  const {
    user: userInfo,
    setRefetch,
    refetch,
    loading: userLoading,
    setUser
  } = useUser();
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(userInfo?.name || ""); // Ensure initial value is the user's name
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const { data, status } = await PrivateAPI.get("/orders/me");
      if (status === 200 && data) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (!name) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const { data, status } = await PrivateAPI.post("/users/update", { name });
      if (data && status === 200) {
        Alert.alert("Success", "Details updated successfully");
        setRefetch(!refetch);
        setModalVisible(false); // Close the modal after saving
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      Alert.alert("Error", "Could not update user details");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <Loader />;
  }

  const renderOrderItem = ({ item }: any) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Order ID: #{item._id}</Text>
      <Text style={styles.orderText}>Total: ₹{item.total}</Text>
      <Text style={styles.orderText}>
        Ordered On:{" "}
        {`${new Date(item.createdAt).toLocaleDateString("en-US", {
          dateStyle: "long",
        })} ${new Date(item.createdAt).toLocaleTimeString("en-US", {
          hour12: true,
        })}`}
      </Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={item.orderItems}
        renderItem={({ item: orderItem, index }: any) => (
          <View style={styles.orderItemDetails}>
            <Image
              source={{ uri: orderItem.image }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{orderItem.name}</Text>
              <Text style={styles.productText}>
                Quantity: {orderItem.quantity}
              </Text>
              <Text style={styles.productText}>Price: ₹{orderItem.price}</Text>
            </View>
          </View>
        )}
        keyExtractor={(orderItem: any, index: number) => index.toString()}
      />
    </View>
  );

  const logoutHandler = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("cart");
    setUser(null);
    router.push("/(routes)/signin");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          flexDirection: "row"
        }}
      >
        <Text style={styles.header}>Profile</Text>

        <MaterialIcons
          name="logout"
          size={24}
          color="black"
          onPress={logoutHandler}
        />
      </View>

      {/* User Details */}
      <View style={styles.userDetails}>
        <Text style={styles.detailText}>Name: {userInfo?.name}</Text>
        <Text style={styles.detailText}>Email: {userInfo?.email}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setName(userInfo?.name || ""); // Populate name state before opening modal
            setModalVisible(true);
          }}
        >
          <Text style={styles.editButtonText}>Edit Details</Text>
        </TouchableOpacity>
      </View>

      {/* Orders */}
      <Text style={styles.ordersHeader}>Previous Orders</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(orderItem: any, index: number) => index.toString()}
      />

      {/* Modal for Editing User Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Edit Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.buttonText}>Saving...</Text>
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userDetails: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  editButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  ordersHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  orderText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  orderItemDetails: {
    flexDirection: "row",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
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
    marginBottom: 4,
    color: "#333",
  },
  productText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
});

export default ProfileScreen;
