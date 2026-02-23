import React, { useEffect, useLayoutEffect } from "react";
import { Platform } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useTranslation } from "react-i18next";

import { useMapStore } from "../googleMap/useMapStore";
import { useUserProfile } from "../../store/user/useUserProfile";
import { useStore } from "../../store"; // Import your main store

import MainNavigator from "./mainNavigator";

export default function MapPage() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  const mapConfig = useMapStore((state) => state.mapConfig);

  // 1. Hook into the global store instead of local useState
  const showOnboarding = useStore((state) => state.showOnboarding);
  const setShowOnBoarding = useStore((state) => state.setShowOnBoarding);

  const { userProfile } = useUserProfile();
  const { t } = useTranslation();

  const getProfile = async () => {
    try {
      if (userProfile) {
        // If the user has no UserName, trigger the onboarding flow
        if (userProfile.UserName == null || userProfile.UserName === "") {
          setTimeout(() => {
            // 2. Update the global store
            setShowOnBoarding(true);
          }, 500);
        }
      }
    } catch (e) {
      console.log({ title: "Error43", message: "e.message" });
    }
  };

  useLayoutEffect(() => {
    getProfile();
  }, [userProfile]);

  useEffect(() => {
    getProfile();
  }, []);

  console.log("showOnboarding state:", showOnboarding);

  return (
    <MainNavigator
      showOnboarding={showOnboarding}
      mapConfig={mapConfig}
    />
  );
}