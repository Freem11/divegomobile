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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: t("Common.login") }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: t("Common.signup") }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: t("Common.resetPassword") }}
      />
    </Stack.Navigator>
  );
}
