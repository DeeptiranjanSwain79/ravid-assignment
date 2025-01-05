import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import Loader from "@/components/loader/Loader";
import useUser from "@/hooks/auth/useUser";

const TabsIndex = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { loading, user } = useUser();
    useEffect(() => {
      if (user != undefined || user != null) {
        setIsLoggedIn(true);
      }
    }, [user]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Redirect href={isLoggedIn ? "/(tabs)" : "/(routes)/signin"} />
      )}
    </>
  );
};

export default TabsIndex;

const styles = StyleSheet.create({});
