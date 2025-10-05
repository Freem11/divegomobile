import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../googleMap";
import OnboardingNavigator from "../tutorial/onboarding/onboardingNavigator";
import SettingsPage from "../screens/settings";
import PartnerRequestParallax from "../screens/partnerAccountRequest/partnerRequestParallax";
import EditScreenParallax from "../screens/edits/editsParallax";
import DiveShopParallax from "../screens/diveShop/diveShopParallax";
import DiveSiteRouter from "../screens/diveSite/diveSiteRouter";

import BottomTabNavigator from "./bottomTabNavigator";
import HomeScreen from "./HomeScreen";

type MainNavigatorProps = {
  showOnboarding: boolean;
  mapConfig: number;
};

export type MainRoutes = {
  Onboarding: undefined;
  BottomTab: undefined;
  GoogleMap: undefined;
  DiveSite: { id: number };
  DiveCentre: { id: number };
  Settings: undefined;
  Home: undefined;
  PartnerRequestUpgrade: undefined;
  EditScreen: undefined;
};

const Stack = createNativeStackNavigator<MainRoutes>();

export default function MainNavigator({ showOnboarding, mapConfig }: MainNavigatorProps) {

  return (
    // The Bottom tab bar only needs to show with config = 0, otherwise simply show the Map page.
    <Stack.Navigator
      initialRouteName={mapConfig === 0 ? "BottomTab" : "GoogleMap"}
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
      })}
    >

      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="BottomTab">
        {props => <BottomTabNavigator {...props} showOnboarding={showOnboarding} />}
      </Stack.Screen>

      <Stack.Screen name="GoogleMap" component={GoogleMap} />

      <Stack.Screen name="DiveSite">
        {({ route }) => (
          <DiveSiteRouter
            id={route.params.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DiveCentre" component={DiveShopParallax} />

      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="Settings" component={SettingsPage} />

      <Stack.Screen name="PartnerRequestUpgrade" component={PartnerRequestParallax} />

      <Stack.Screen name="EditScreen" component={EditScreenParallax} />

    </Stack.Navigator>
  );
}
