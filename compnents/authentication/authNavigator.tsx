import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../styles";
import ButtonIcon from "../reusables/buttonIcon";

import LandingScreen from "./landingPage";
import LoginScreen from "./loginPage";
import SignUpScreen from "./signupPage";
import ForgotPasswordScreen from "./forgotPasswordPage";
import AuthHeader from "./AuthHeader";

export type AuthenticationRoutes = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export const Stack = createNativeStackNavigator<AuthenticationRoutes>();

export default function AuthenticationNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: () => <AuthHeader />,
        headerLeft: () => ButtonIcon({
          icon: "chevron-left",
          onPress: navigation.goBack,
          size: "small",
          fillColor: colors.neutralGrey
        }),
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: colors.themeWhite,
        },
      })}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}