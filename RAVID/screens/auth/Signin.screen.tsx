import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { CommonStyles } from "@/styles/common.styles";
import { router } from "expo-router";
import BackendAPI from "@/utils/axios-client";
import { Toast } from "react-native-toast-notifications";

const SigninScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [required, setRequired] = useState(false);
  const [error, setError] = useState({
    password: "",
  });
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "815876125015-p91jqin522ms4p2nk3114kuko7k0ftob.apps.googleusercontent.com",
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

  const handleSignin = async () => {
    try {
      setButtonSpinner(true);
      const response = await BackendAPI.post("/users/login", {
        email: userInfo.emailOrUsername,
        password: userInfo.password,
      });

      if (response && response.data && response.status === 200) {
        await AsyncStorage.setItem("token", response.data.token);
        Toast.show("Logged in successfully", {
          type: "success",
        });
        router.push("/(tabs)");
      }
      setButtonSpinner(false);
    } catch (error: any) {
      setButtonSpinner(false);
      console.log(error?.response?.data?.message);
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
        <Text style={[styles.welcomeText]}>Welcome Back!</Text>

        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[CommonStyles.input, { paddingLeft: 40 }]}
              keyboardType="email-address"
              value={userInfo.emailOrUsername}
              onChangeText={(text) =>
                setUserInfo((prevUserInfo) => ({
                  ...prevUserInfo,
                  emailOrUsername: text,
                }))
              }
              placeholder="johndoe@example.com"
            />
            <Fontisto
              name="email"
              size={20}
              color={"#A1A1A1"}
              style={{ position: "absolute", left: 26, top: 17.8 }}
            />
            {required && (
              <View style={CommonStyles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
              </View>
            )}

            <View style={{ marginTop: 15 }}>
              <TextInput
                style={CommonStyles.input}
                keyboardType="default"
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
              <View style={[CommonStyles.errorContainer, { top: 125 }]}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={{ color: "red", fontSize: 11, marginTop: -3 }}>
                  {error.password}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[CommonStyles.buttonContainer, { marginTop: 10 }]}
                onPress={handleSignin}
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
                  Sign in
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
                <FontAwesome name="google" size={30} />
              </TouchableOpacity>
            </View>

            <View style={styles.signUpRedirect}>
              <Text style={{ fontSize: 18, fontFamily: "Raleway_600SemiBold" }}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(routes)/signup")}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Nunito_400Regular",
                    color: "#2467EC",
                    marginLeft: 5,
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <Button title="Sign in with Google" onPress={() => promptAsync()} /> */}
    </LinearGradient>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 250,
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
