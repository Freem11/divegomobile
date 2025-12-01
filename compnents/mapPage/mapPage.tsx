import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Platform,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useTranslation } from "react-i18next";
import { set } from "react-hook-form";

import { useMapStore } from "../googleMap/useMapStore";
import { useUserProfile } from "../../store/user/useUserProfile";
import NotificationsButton from "../reusables/bottomMenu/buttons/notificationsButton";
import { useNotificationsStore } from "../feed/store/useNotificationsStore";

import MainNavigator from "./mainNavigator";

export default function MapPage() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  const mapConfig = useMapStore((state) => state.mapConfig);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const { userProfile } = useUserProfile();

  const initNotifications = useNotificationsStore((s) => s.init);
  const count = useNotificationsStore((s) => s.count);

  const { t } = useTranslation();

  const getProfile = async () => {
    try {
      if (userProfile) {
        if (userProfile.UserName == null || userProfile.UserName === "") {
          setTimeout(() => {
            setShowOnboarding(true);
          }, 500);
        }
      }
    } catch (e) {
      console.log({ title: "Error43", message: "e.message" });
    }
  };

  useLayoutEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    getProfile();
    initNotifications(userProfile.UserID);
  }, []);

  return (
    <MainNavigator showOnboarding={showOnboarding} mapConfig={mapConfig} />
  );
}
