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
import UserProfileParallax from "../screens/userProfile/userProfileParallax";
import SiteSubmitterRouter from "../screens/formScreens/siteSubmitter/siteSubmitterRouter";
import PartnerRequestRouter from "../screens/formScreens/partnerRequests/partnerRequestRouter";
import CommentsModal from "../modals/commentsModal";
import { EDIT_TYPE } from "../../entities/editTypes";

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
  DiveSiteNavigator: { id: number };
  DiveShopNavigator: { id: number };
  SiteSubmitterNavigator: undefined;
  Settings: undefined;
  Home: undefined;
  PartnerRequestUpgrade: undefined;
  EditScreen: { id: number, dataType: EDIT_TYPE };
  UserProfilePhotos: undefined;
  PhotoComments: { id: number };
  PinchAndZoomPhoto: undefined;
  UserProfile: { id: number };
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

      <Stack.Screen name="EditScreen">
        {({ route }) => (
          <EditScreenParallax
            id={route.params.id}
            dataType={route.params.dataType}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SiteSubmitterNavigator" component={SiteSubmitterRouter} />

      <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen name="PartnerRequestUpgrade" component={PartnerRequestRouter} />
      <Stack.Screen name="UserProfilePhotos" component={UserProfilePhotosPage} />

      <Stack.Screen name="PhotoComments">
        {({ route }) => (
          <CommentsModal
            id={route.params.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="PinchAndZoomPhoto" component={PhotoBoxModal} />
      <Stack.Screen name="UserProfile">
        {({ route }) => (
          <UserProfileParallax
            profileID={route.params.id}
          />
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
}
