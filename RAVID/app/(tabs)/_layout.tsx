import Loader from "@/components/loader/Loader";
import useUser from "@/hooks/auth/useUser";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

const TabsLayout = () => {
  const { loading } = useUser();

  if (loading) {
    return <Loader />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === "index") {
              iconName = require("@/assets/icons/HouseSimple.png");
            } else if (route.name === "cart/index") {
              iconName = require("@/assets/icons/ShoppingCart.png");
            } else if (route.name === "profile/index") {
              iconName = require("@/assets/icons/User.png");
            } else if (route.name === "search/index") {
              iconName = require("@/assets/icons/search.png");
            }
            return (
              <Image
                style={{ width: 25, height: 25, tintColor: color }}
                source={iconName}
              />
            );
          },
          headerShown: false,
          tabBarShowLabel: false,
        };
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="cart/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
};

export default TabsLayout;
