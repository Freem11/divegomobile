import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../googleMap";
import OnboardingNavigator from "../tutorial/onboarding/onboardingNavigator";
import SettingsPage from "../screens/settings";
import PartnerRequestParallax from "../screens/partnerAccountRequest/partnerRequestParallax";
import EditScreenParallax from "../screens/edits/editsParallax";
import DiveSiteParallax from "../screens/diveSite/diveSiteParallax";
import DiveShopParallax from "../screens/diveShop/diveShopParallax";
import SiteSubmitterParallax from "../screens/diveSiteUploader/siteSubmitterParallax";
import UserProfileParallax from "../screens/userProfile/userProfileParallax";

import HomeScreen from "./HomeScreen";
import BottomTabNavigator from "./bottomTabNavigator";

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
  SiteSubmitter: undefined;
  UserProfile: { id: number };
};

const Stack = createNativeStackNavigator<MainRoutes>();

export default function MainNavigator({ showOnboarding }: MainNavigatorProps) {

  return (
    // The Bottom tab bar only needs to show with config = 0, otherwise simply show the Map page.
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
      })}
    >

      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="BottomTab">
        {props => <BottomTabNavigator {...props} showOnboarding={showOnboarding} />}
      </Stack.Screen>

      {/* <Stack.Screen name="GoogleMap" component={GoogleMap} /> */}

      <Stack.Screen name="DiveSite" component={DiveSiteParallax} />
      <Stack.Screen name="DiveCentre" component={DiveShopParallax} />

      <Stack.Screen name="SiteSubmitter" component={SiteSubmitterParallax} />

      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}

      <Stack.Screen name="UserProfile" component={UserProfileParallax} />

      <Stack.Screen name="Settings" component={SettingsPage} />

      <Stack.Screen name="PartnerRequestUpgrade" component={PartnerRequestParallax} />

      <Stack.Screen name="EditScreen" component={EditScreenParallax} />

    </Stack.Navigator>
  );
}
