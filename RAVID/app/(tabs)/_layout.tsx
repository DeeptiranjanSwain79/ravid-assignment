import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
} from "react-native";
import { Tabs } from "expo-router";
import useUser from "@/hooks/auth/useUser";
import Loader from "@/components/loader/Loader";
import { AntDesign } from "@expo/vector-icons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import HamburgerMenu from "@/components/menu/HamBurgerMenu";

const TabsLayout: React.FC = () => {
  const { loading } = useUser();

  if (loading) {
    return <Loader />;
  }

  const tabBarIcon = (
    iconName: React.ComponentProps<typeof AntDesign>["name"],
    label: string,
    isFocused: boolean
  ) => {
    return (
      <View style={styles.tabBarItem}>
        <View
          style={[
            styles.iconContainer,
            isFocused && styles.iconContainerSelected,
          ]}
        >
          <AntDesign
            name={iconName}
            size={25}
            style={[isFocused ? styles.iconSelected : styles.iconDefault]}
          />
        </View>
        <Text style={[styles.label, isFocused && styles.labelSelected]}>
          {label}
        </Text>
      </View>
    );
  };

  const CustomTabBarButton: React.FC<
    BottomTabBarButtonProps & {
      label: string;
      iconName: React.ComponentProps<typeof AntDesign>["name"];
    }
  > = ({ onPress, accessibilityState, label, iconName }) => {
    const isFocused = accessibilityState?.selected || false;

    return (
      <TouchableOpacity
        onPress={(event: GestureResponderEvent) => {
          if (onPress) onPress(event);
        }}
        style={styles.tabBarButton}
      >
        {tabBarIcon(iconName, label, isFocused)}
      </TouchableOpacity>
    );
  };

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerStyle: styles.header,
        headerLeft: () => <HamburgerMenu />,
        headerRight: () => (
          <Image
            source={{
              uri: "https://ui-avatars.com/api/?name=da&background=bb58f5&color=000",
            }}
            style={styles.headerImage}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="dna/index"
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              label="My DNA"
              iconName="medicinebox"
            />
          ),
          title: "",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} label="Home" iconName="home" />
          ),
          title: "",
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              label="Settings"
              iconName="setting"
            />
          ),
          title: "",
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 75,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerSelected: {
    height: 60,
    width: 60,
    backgroundColor: "#4287f5",
    marginTop: -25,
    borderRadius: 30,
  },
  iconDefault: {
    color: "#4287f5",
  },
  iconSelected: {
    color: "white",
    fontSize: 35,
  },
  label: {
    fontSize: 12,
    color: "#4287f5",
    marginTop: 1,
    textAlign: "center",
  },
  labelSelected: {
    textAlign: "center",
  },
  header: {
    backgroundColor: "white",
    height: 75,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  hamburgerMenu: {
    marginLeft: 15,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
});

export default TabsLayout;
