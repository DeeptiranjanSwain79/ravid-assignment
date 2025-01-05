import { User } from "@/types/global";
import { PrivateAPI } from "@/utils/axios-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const useUser = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>();
  const [error, setError] = useState("");
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await PrivateAPI.get("/users/me");
        if (response && response.data && response.status === 200) {
          setUser(response.data.user);
        }
        setLoading(false);
      } catch (error: any) {
        await AsyncStorage.removeItem("token");
        router.push("/(routes)/signin");
        setLoading(false);
        setError(error?.response?.data?.message || error.message);
        console.log(error?.response?.data?.message || error);
      }
    })();
  }, [refetch]);
  return { loading, user, error, setRefetch, refetch, setUser };
};

export default useUser;
