import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  Animated,
  ImageBackground,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import icons from "@/assets/icons/icons";

const menuIconWithText = [
  {
    image: icons.wallet,
    text: "My Wallet",
  },
  {
    image: icons.profile,
    text: "My Public Profile",
  },
  {
    image: icons.clinic,
    text: "Add Clinic Solution",
  },
  {
    image: icons.arrows,
    text: "Collaborations",
  },
  {
    image: icons.keys,
    text: "Permissions Management",
  },
  {
    image: icons.english,
    text: "English",
  },
];

const HamburgerMenu: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-340)).current;
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handlePress = (index: number) => {
    setSelectedItem(index);
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  return (
    <>
      {/* Hamburger Icon */}
      <TouchableOpacity onPress={openMenu} style={styles.hamburgerIcon}>
        <AntDesign name="menuunfold" size={24} color="#4287f5" />
      </TouchableOpacity>

      {/* Sidebar Menu */}
      {menuVisible && (
        <Modal
          animationType="none"
          transparent={true}
          visible={menuVisible}
          onRequestClose={closeMenu}
        >
          {/* Transparent Top Section */}
          <TouchableOpacity
            style={styles.transparentTop}
            onPress={closeMenu}
            activeOpacity={1}
          />

          {/* Semi-Transparent Overlay */}
          <TouchableOpacity
            style={styles.overlay}
            onPress={closeMenu}
            activeOpacity={1}
          />

          {/* Sidebar */}
          <Animated.View
            style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
          >
            <ImageBackground
              source={{
                uri: "https://img.freepik.com/free-photo/macro-shot-transparent-liquid-splash_23-2148469590.jpg",
              }} // Background image
              style={styles.background}
            >
              <View style={styles.leftSection}>
                <Text style={styles.text1}>Dani Alves</Text>
                <Text style={styles.text2}>user: #12345</Text>
                <Text style={[styles.text2, { marginTop: 5 }]}>
                  abcd@test.com
                </Text>
                <Text
                  style={styles.lastText}
                  onPress={() => router.push("/(tabs)/settings")}
                >
                  User Profile Settings
                </Text>
              </View>

              <View style={styles.rightSection}>
                <Image
                  source={{
                    uri: "https://ui-avatars.com/api/?name=da&background=bb58f5&color=000", // Profile picture
                  }}
                  style={styles.profilePicture}
                />
              </View>
            </ImageBackground>

            <View style={styles.container}>
              {menuIconWithText.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    selectedItem === index && styles.selectedItem, // Apply style if selected
                  ]}
                  onPress={() => handlePress(index)}
                >
                  <Image source={item.image} style={styles.icon} />
                  <Text style={styles.text}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push("/(tabs)/dna")}
              >
                <AntDesign name="like2" size={32} color="#4287f5" />
                <Text style={[styles.actionText, { color: "#4287f5" }]}>
                  Send Feedback
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push("/(tabs)/settings")}
              >
                <AntDesign name="logout" size={32} color="red" />
                <Text style={[styles.actionText, { color: "red" }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerIcon: {
    marginLeft: 15,
  },
  transparentTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80, // Match tab header height
    backgroundColor: "transparent",
  },
  overlay: {
    position: "absolute",
    top: 80, // Below the transparent top
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.212)",
  },
  sidebar: {
    position: "absolute",
    top: 80,
    left: 0,
    height: "89.6%",
    width: 340,
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  background: {
    justifyContent: "space-between",
    flexDirection: "row",
    height: 170,
    width: 320,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  leftSection: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "60%",
  },
  rightSection: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "40%",
  },
  text1: {
    fontSize: 18,
    color: "black",
    fontWeight: "700",
  },
  text2: {
    fontSize: 12,
    color: "#646363",
    fontWeight: "400",
  },
  lastText: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 50,
    color: "#4287f5",
    textDecorationLine: "underline",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "white",
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: "#f5f7c8",
    borderRadius: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  box: {
    backgroundColor: "#f0f0f0c2",
    borderRadius: 10,
    padding: 20,
    alignItems: "flex-start",
    marginTop: 65,
    borderWidth: 1,
    borderColor: "#d3d2d2",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Space between items
  },
  actionText: {
    fontSize: 16,
    marginLeft: 20, // Space between the icon and text
    fontWeight: "500",
  },
});

export default HamburgerMenu;
