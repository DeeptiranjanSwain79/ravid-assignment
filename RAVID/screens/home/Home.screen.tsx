import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import icons from "@/assets/icons/icons";
import { heightPercentageToDP } from "react-native-responsive-screen";

const boxItems = [
  {
    id: 1,
    heading: "Appointments",
    texts: ["Upcoming Appointments", "Scheduled Appointments", "Reminders"],
    icon: "calendar",
  },
  {
    id: 2,
    heading: "Diagnosis",
    texts: ["QR Code enabled Upload", "2nd Opinion", "My Diagnosis Data"],
    icon: "folder1",
  },
  {
    id: 3,
    heading: "Mobile Health",
    texts: [
      "Top Doctor's list",
      "Sleep Quantity Trends",
      "Blood Pressure Chart",
    ],
    icon: "paperclip",
  },
  {
    id: 4,
    heading: "Notes",
    texts: ["Add Notes", "Manage Notes"],
    icon: "edit",
  },
  {
    id: 5,
    heading: "Prescriptions",
    texts: ["QR Code enabled Upload", "My Prescriptions"],
    icon: "trademark",
  },
  {
    id: 6,
    heading: "Preventive/Services",
    texts: [
      "Cancer Screening",
      "Diabetes Screening",
      "Genomic Services",
      "Longevity & Wellness",
      "Multidisciplinary",
    ],
    icon: "medicinebox",
  },
];

const HomeScreen = () => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  const handleSelectBox = (id: number) => {
    setSelectedBox(id === selectedBox ? null : id); // Toggle selection
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Greeting Message */}
        <View
          style={{
            marginBottom: 15,
            flexDirection: "row",
            justifyContent: "flex-end", // Align items to the right
            alignItems: "center", // Center align the items vertically
          }}
        >
          <Image
            source={icons.morning}
            style={{
              width: 24,
              height: 24,
              marginRight: 10, // Reduce margin for better spacing
            }}
          />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#650d0d" }}>
            Good Morning, Dani
          </Text>
        </View>

        {/* Boxes */}
        <View style={styles.boxContainer}>
          {boxItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.box,
                selectedBox === item.id && styles.selectedBox,
              ]}
              onPress={() => handleSelectBox(item.id)}
            >
              <Text style={styles.boxHeading}>{item.heading}</Text>
              <View style={{ marginTop: 15 }}>
                {item.texts.map((text, index) => (
                  <Text key={index} style={styles.boxText}>
                    {text}
                  </Text>
                ))}
              </View>
              <AntDesign
                name={item.icon as any} // Type assertion to fix the icon type error
                size={selectedBox === item.id ? 30 : 24} // Icon gets bigger when selected
                color={selectedBox === item.id ? "#8dc8eb" : "#333"} // Icon color changes when selected
                style={[
                  styles.icon,
                  selectedBox === item.id && { fontSize: 45 },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 1, // Ensure there's padding at the bottom for smooth scrolling
  },
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Ensures boxes are arranged in a responsive manner
    justifyContent: "space-between",
    width: "100%",
    height: heightPercentageToDP("100%"),
  },
  box: {
    backgroundColor: "#e0e0e0", // Initial background color (gray)
    borderRadius: 10,
    width: "48%", // Two boxes per row
    padding: 16,
    marginBottom: 16,
    alignItems: "flex-start",
    position: "relative",
    height: heightPercentageToDP("25%"),
  },
  selectedBox: {
    backgroundColor: "#c8d6eb", // Light blue when selected
  },
  boxHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  boxText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
  },
  icon: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default HomeScreen;
