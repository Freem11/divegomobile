import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../styles";
import LandingScreen from "./landingPage";
import LoginScreen from "./loginPage";
import SignUpScreen from "./signupPage";
import ForgotPasswordScreen from "./forgotPasswordPage";
import TabletAuthHeader from "./TabletHeader";
import { Platform, Dimensions } from "react-native";
import ButtonIcon from "../reusables/buttonIcon"

// All Authentication flow related routes for type safety.
export type AuthenticationRoutes = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthenticationRoutes>();

export default function AuthenticationNavigator() {
  const { width, height } = Dimensions.get('window');

  const isTablet = (Platform.OS === 'ios' && Platform.isPad) || (Platform.OS === 'android' && Math.min(width, height) >= 600);

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: isTablet ? () => <TabletAuthHeader /> : undefined,
        headerLeft: () => ButtonIcon({
          icon: "chevron-left",
          onPress: navigation.goBack,
          size: 'small',
          fillColor: colors.neutralGrey
        }),
        headerTransparent: true,
        headerTitle: "",
        headerBackButtonDisplayMode: "minimal", // hide back button label (iOS)
        headerTintColor: colors.neutralGrey,
        headerShadowVisible: false,
        animation: "slide_from_right",
        gestureEnabled: true,
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
