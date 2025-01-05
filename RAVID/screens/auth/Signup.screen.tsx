import { CommonStyles } from "@/styles/common.styles";
import BackendAPI from "@/utils/axios-client";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log(createdSessionId)
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [required, setRequired] = useState(false);
  const [error, setError] = useState({
    password: "",
  });

  const handlePasswordValidation = (value: string) => {
    const password = value;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordEightValue = /(?=.{8,})/;

    if (!passwordSpecialCharacter.test(password)) {
      setError((prevError) => ({
        ...prevError,
        password: "Password must contain one special character",
      }));
      setUserInfo((prevUserInfo) => ({ ...prevUserInfo, password: "" }));
    } else if (!passwordOneNumber.test(password)) {
      setError((prevError) => ({
        ...prevError,
        password: "Write at least one number",
      }));
      setUserInfo((prevUserInfo) => ({ ...prevUserInfo, password: "" }));
    } else if (!passwordEightValue.test(password)) {
      setError((prevError) => ({
        ...prevError,
        password: "Password must contain at least eight characters",
      }));
      setUserInfo((prevUserInfo) => ({ ...prevUserInfo, password: "" }));
    } else {
      setError((prevError) => ({
        ...prevError,
        password: "",
      }));
      setUserInfo((prevUserInfo) => ({ ...prevUserInfo, password }));
    }
  };

  const handleSignup = async () => {
    try {
      setError({
        password: "",
      });
      setButtonSpinner(true);
      const response = await BackendAPI.post("/users/register", {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
      });
      if (response && response.data && response.status === 201) {
        await AsyncStorage.setItem("token", response.data.token);
        Toast.show(response?.data?.message, { type: "success" });
        setUserInfo({
          name: "",
          email: "",
          password: "",
        });
        router.push("/(tabs)");
      }
      setButtonSpinner(false);
    } catch (error: any) {
      setButtonSpinner(false);
      Toast.show(error?.response?.data?.message, { type: "danger" });
      setError({
        ...error,
        password: error?.response?.data?.message,
      });
    }
  };

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 20 }}
    >
      <ScrollView>
        <Text style={[styles.welcomeText]}>Let's get started!</Text>

        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[CommonStyles.input, { paddingLeft: 40 }]}
              value={userInfo.name}
              onChangeText={(text) =>
                setUserInfo((prevUserInfo) => ({
                  ...prevUserInfo,
                  name: text,
                }))
              }
              placeholder="john Doe"
            />
            <AntDesign
              style={{ position: "absolute", left: 26, top: 19 }}
              name="user"
              size={20}
              color={"#A1A1A1"}
            />

            <TextInput
              style={[CommonStyles.input, { paddingLeft: 40, marginTop: 15 }]}
              keyboardType="email-address"
              value={userInfo.email}
              onChangeText={(text) =>
                setUserInfo((prevUserInfo) => ({
                  ...prevUserInfo,
                  email: text,
                }))
              }
              placeholder="johndoe@example.com"
            />
            <Fontisto
              name="email"
              size={20}
              color={"#A1A1A1"}
              style={{ position: "absolute", left: 26, top: 90 }}
            />
            {required && (
              <View style={CommonStyles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
              </View>
            )}

            <View style={{ marginTop: 15 }}>
              <TextInput
                style={CommonStyles.input}
                secureTextEntry={!passwordVisible}
                defaultValue=""
                placeholder="********"
                onChangeText={handlePasswordValidation}
              />

              <TouchableOpacity
                style={styles.visibleIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={23}
                    color={"#747474"}
                  />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={"#747474"} />
                )}
              </TouchableOpacity>
              <SimpleLineIcons
                style={styles.icon2}
                name="lock"
                size={20}
                color={"#A1A1A1"}
              />
            </View>
            {error.password && (
              <View style={[CommonStyles.errorContainer, { bottom: 20 }]}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={{ color: "red", fontSize: 11, marginTop: -3 }}>
                  {error.password}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[CommonStyles.buttonContainer, { marginTop: 20 }]}
              onPress={handleSignup}
            >
              {buttonSpinner ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 16,
                    fontFamily: "Raleway_700Bold",
                  }}
                >
                  Sign up
                </Text>
              )}
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
                gap: 20,
              }}
            >
              <TouchableOpacity>
                <FontAwesome name="google" size={30} onPress={onGooglePress} />
              </TouchableOpacity>
            </View>

            <View style={styles.signUpRedirect}>
              <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(routes)/signin")}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Nunito_400Regular",
                    color: "#2467EC",
                    marginLeft: 5,
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 200,
  },
  learningText: {
    textAlign: "center",
    color: "#575757",
    fontSize: 15,
    marginTop: 5,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    rowGap: 30,
  },
  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15,
  },
  icon2: {
    position: "absolute",
    left: 24,
    top: 17.8,
    marginTop: -2,
  },
  forgotSection: {
    marginHorizontal: 16,
    textAlign: "right",
    fontSize: 16,
    marginTop: 15,
  },
  signUpRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
});
