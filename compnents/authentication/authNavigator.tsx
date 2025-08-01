import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../styles";
import LandingScreen from "./landingPage";
import LoginScreen from "./loginPage";
import SignUpScreen from "./signupPage";
import ForgotPasswordScreen from "./forgotPasswordPage";
import { useTranslation } from "react-i18next";

// All Authentication flow related routes for type safety.
export type AuthenticationRoutes = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthenticationRoutes>();

export default function AuthenticationNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: "",
        headerBackButtonDisplayMode: "minimal", // hide back button label (iOS)
        headerTintColor: colors.darkGrey,
        headerShadowVisible: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: colors.themeWhite,
        },
      }}
    >
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ animation: "slide_from_left" }}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
