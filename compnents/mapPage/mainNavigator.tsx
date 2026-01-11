import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../googleMap";
import OnboardingNavigator from "../tutorial/onboarding/onboardingNavigator";
import SettingsPage from "../screens/settings";
import EditScreenParallax from "../screens/edits/editsParallax";
import DiveSiteRouter from "../screens/diveSite/diveSiteRouter";
import UserProfilePhotosPage from "../screens/userProfilePhotos";
import PhotoBoxModal from "../screens/photoBox/photoBoxModal";
import DiveShopRouter from "../screens/diveShop/diveShopRouter";
import PartnerRequestRouter from "../screens/formScreens/partnerRequests/partnerRequestRouter";
import ReviewParallax from "../screens/review/reviewParallax";
import ResetPasswordConfirmScreen from "../authentication/passwordResetPage";
import { EDIT_TYPE } from "../../entities/editTypes";
import { useStore } from "../../store";
import PhotoCommentsParallax from "../screens/comments/photoCommentsParallax";

import HomeScreen from "./HomeScreen";
import BottomTabNavigator, { BottomTabRoutes } from "./bottomTabNavigator";

type MainNavigatorProps = {
  showOnboarding: boolean;
  mapConfig: number;
};

export type MainRoutes = {
  Onboarding: undefined;
  BottomTab: undefined | { screen: keyof BottomTabRoutes; params?: any };
  GoogleMap: undefined;
  DiveSiteNavigator: { id: number };
  DiveShopNavigator: { id: number };
  Settings: undefined;
  Home: undefined;
  PartnerRequestUpgrade: undefined;
  EditScreen: { id: number, dataType: EDIT_TYPE };
  UserProfilePhotos: undefined;
  PhotoComments: { id: number };
  PinchAndZoomPhoto: { id?: number, photoFile: string };
  SingleReviewScreen: { id: number };
  ResetPasswordConfirm: undefined;
};

const Stack = createNativeStackNavigator<MainRoutes>();

export default function MainNavigator({ showOnboarding, mapConfig }: MainNavigatorProps) {
  const isRecovering = useStore((state) => state.isRecovering);
  const setIsRecovering = useStore((state) => state.setIsRecovering);

  const getInitialRoute = () => {
    if (isRecovering) return "ResetPasswordConfirm";
    return mapConfig === 0 ? "BottomTab" : "GoogleMap";
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="BottomTab">
        {(props) => (
          <BottomTabNavigator
            {...props}
            showOnboarding={showOnboarding}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GoogleMap" component={GoogleMap} />
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="DiveSiteNavigator">
        {({ route }) => <DiveSiteRouter id={route.params.id} />}
      </Stack.Screen>

      <Stack.Screen name="DiveShopNavigator">
        {({ route }) => <DiveShopRouter id={route.params.id} />}
      </Stack.Screen>

      <Stack.Screen name="EditScreen">
        {({ route }) => <EditScreenParallax id={route.params.id} dataType={route.params.dataType} />}
      </Stack.Screen>

      <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen name="PartnerRequestUpgrade" component={PartnerRequestRouter} />
      <Stack.Screen name="UserProfilePhotos" component={UserProfilePhotosPage} />

      <Stack.Screen name="PhotoComments">
        {({ route }) => (
          <PhotoCommentsParallax
            id={route.params.id}
          />
        )}
      </Stack.Screen>

      {/* <Stack.Screen name="PinchAndZoomPhoto" component={PhotoBoxModal} /> */}

      <Stack.Screen name="PinchAndZoomPhoto">
        {({ route }) => (
          <PhotoBoxModal
            id={route.params.id}
            photoFile={route.params.photoFile}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SingleReviewScreen">
        {({ route }) => (
          <ReviewParallax
            id={route.params.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="ResetPasswordConfirm"
        component={ResetPasswordConfirmScreen}
        options={{
          headerShown: false,
          headerTitle: "Reset Password",
          animation: "slide_from_bottom"
        }}
        listeners={{
          blur: () => setIsRecovering(false),
        }}
      />
    </Stack.Navigator>
  );
}