import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../googleMap";
import OnboardingNavigator from "../tutorial/onboarding/onboardingNavigator";
import SettingsPage from "../screens/settings";
import EditScreenParallax from "../screens/edits/editsParallax";
import DiveSiteRouter from "../screens/diveSite/diveSiteRouter";
import UserProfilePhotosPage from "../screens/userProfilePhotos";
import PhotoBoxModal from "../screens/photoBox/photoBoxModal";
import DiveShopRouter from "../screens/diveShop/diveShopRouter";
import PartnerRequestRouter from "../screens/partnerAccountRequest/partnerRequestRouter";

import BottomTabNavigator from "./bottomTabNavigator";
import HomeScreen from "./HomeScreen";
import SiteSubmitterNavigator from "../screens/diveSiteUploader/siteSubmitterNavigator";

type MainNavigatorProps = {
  showOnboarding: boolean;
  mapConfig: number;
};

export type MainRoutes = {
  Onboarding: undefined;
  BottomTab: undefined;
  GoogleMap: undefined;
  DiveSiteNavigator: { id: number };
  DiveShopNavigator: { id: number };
  SiteSubmitterNavigator: undefined;
  Settings: undefined;
  Home: undefined;
  PartnerRequestUpgrade: undefined;
  EditScreen: undefined;
  UserProfilePhotos: undefined;
  PinchAndZoomPhoto: undefined;
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
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="DiveSiteNavigator">
        {({ route }) => (
          <DiveSiteRouter
            id={route.params.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DiveShopNavigator">
        {({ route }) => (
          <DiveShopRouter
            id={route.params.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SiteSubmitterNavigator" component={SiteSubmitterNavigator} />

      <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen name="PartnerRequestUpgrade" component={PartnerRequestRouter} />
      <Stack.Screen name="EditScreen" component={EditScreenParallax} />
      <Stack.Screen name="UserProfilePhotos" component={UserProfilePhotosPage} />
      <Stack.Screen name="PinchAndZoomPhoto" component={PhotoBoxModal} />

    </Stack.Navigator>
  );
}
