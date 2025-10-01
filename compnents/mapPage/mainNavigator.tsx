import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";
import { useTranslation } from "react-i18next";

import GoogleMap from "../googleMap";
import BottomMenu from "../reusables/bottomMenu";
import ProfileButton from "../reusables/bottomMenu/buttons/profileButton";
import SiteSearchButton from "../reusables/bottomMenu/buttons/siteSearchButton";
import DiveSiteButton from "../reusables/bottomMenu/buttons/diveSiteButton";
import ItineraryListButton from "../reusables/bottomMenu/buttons/itineraryCreatorButton";
import GuidesButton from "../reusables/bottomMenu/buttons/guidesButton";
import AnimalTagsContainer from "../animalTags/animalTagContainer";
import AnimatedFullScreenModal from "../reusables/animatedFullScreenModal";
import LevelOneScreen from "../reusables/levelOneScreen";
import LevelTwoScreen from "../reusables/levelTwoScreen";
import LevelThreeScreen from "../reusables/levelThreeScreen";
import {
  grabProfileByUserId,
  updateProfileFeeback,
} from "../../supabaseCalls/accountSupabaseCalls";
import {
  getPhotosWithUser,
  getPhotosWithUserEmpty,
} from "../../supabaseCalls/photoSupabaseCalls";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SessionContext } from "../contexts/sessionContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import BottomDrawer from "../screens/bottomDrawer/animatedBottomDrawer";
import { useMapStore } from "../googleMap/useMapStore";
import { EmailFeedback } from "../feed/emailFeedback";
import FeedScreens from "../feed/screens";
import SearchTool from "../searchTool";
import { ActiveProfile } from "../../entities/profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as S from "./styles";
import BottomTabNavigator from "./bottomTabNavigator";
import OnboardingNavigator from "../tutorial/onboarding/onboardingNavigator";

import LandingScreen from "../authentication/landingPage";

type MainNavigatorProps = {
  showOnboarding: boolean;
  mapConfig: number;
}

export type MainRoutes = {
  Onboarding: undefined;
  BottomTab: undefined;
  GoogleMap: undefined;
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
      })}>

      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="BottomTab">
        {props => <BottomTabNavigator {...props} showOnboarding={showOnboarding} />}
      </Stack.Screen>

      <Stack.Screen name="GoogleMap" component={GoogleMap} />

    </Stack.Navigator>
  );
}
