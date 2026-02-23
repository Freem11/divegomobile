import React, { useState, useCallback, useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, createNavigationContainerRef, NavigationIndependentTree } from "@react-navigation/native";
import { I18nextProvider } from "react-i18next";
import Toast from "react-native-toast-message";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "web-streams-polyfill";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Linking from "expo-linking";

import MapPage from "./compnents/mapPage/mapPage";
import { AppContextProvider } from "./compnents/contexts/appContextProvider";
import { toastConfig } from "./compnents/toast";
import AuthenticationNavigator from "./compnents/authentication/authNavigator";
import { useUserProfile } from "./store/user/useUserProfile";
import { useUserHandler } from "./store/user/useUserHandler";
import { initI18n, i18n } from "./i18n";
import { createSessionFromUrl } from "./compnents/helpers/loginHelpers";
import { resetPasswordURL } from "./compnents/globalVariables";

// 1. Prevent hiding immediately (outside the component)
SplashScreen.preventAutoHideAsync().catch(() => { });

export const navigationRef = createNavigationContainerRef<any>();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { userProfile } = useUserProfile();
  const userHandler = useUserHandler();

  // Screen Orientation Lock
  useEffect(() => {
    if (Platform.OS === "ios") {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  }, []);

  // Deep Linking Configuration
  const linking = {
    prefixes: ["scubaseasons://"],
    config: { screens: {} },
    subscribe(listener: (url: string) => void) {
      const onReceiveURL = async ({ url }: { url: string }) => {
        if (url.startsWith(resetPasswordURL) && url.includes("type=recovery")) {
          await createSessionFromUrl(url);
          userHandler.setIsRecovering(true);
          await userHandler.userInit(true);
          return;
        }
        listener(url);
      };
      const subscription = Linking.addEventListener("url", onReceiveURL);
      const checkInitialUrl = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          if (initialUrl.startsWith(resetPasswordURL) && initialUrl.includes("type=recovery")) {
            await createSessionFromUrl(initialUrl);
            userHandler.setIsRecovering(true);
            await userHandler.userInit(true);
          } else {
            listener(initialUrl);
          }
        }
      };
      checkInitialUrl();
      return () => subscription.remove();
    },
  };

  // Font Loading
  const [fontsLoaded] = useFonts({
    RobotoBlack: require("./assets/Roboto/Roboto-Black.ttf"),
    SFBlack: require("./assets/SanFran/SF-Pro-Display-Black.otf"),
    RobotoBlackItalic: require("./assets/Roboto/Roboto-BlackItalic.ttf"),
    SFBlackItalic: require("./assets/SanFran/SF-Pro-Display-BlackItalic.otf"),
    RobotoBold: require("./assets/Roboto/Roboto-Bold.ttf"),
    SFSemibold: require("./assets/SanFran/SF-Pro-Display-Semibold.otf"),
    SFBold: require("./assets/SanFran/SF-Pro-Display-Bold.otf"),
    RobotoBoldItalic: require("./assets/Roboto/Roboto-BoldItalic.ttf"),
    SFBoldItalic: require("./assets/SanFran/SF-Pro-Display-BoldItalic.otf"),
    RobotoItalic: require("./assets/Roboto/Roboto-Italic.ttf"),
    SFItalic: require("./assets/SanFran/SF-Pro-Display-RegularItalic.otf"),
    RobotoLight: require("./assets/Roboto/Roboto-Light.ttf"),
    SFLight: require("./assets/SanFran/SF-Pro-Display-Light.otf"),
    RobotoLightItalic: require("./assets/Roboto/Roboto-LightItalic.ttf"),
    SFLightItalic: require("./assets/SanFran/SF-Pro-Display-LightItalic.otf"),
    RobotoMedium: require("./assets/Roboto/Roboto-Medium.ttf"),
    SFMedium: require("./assets/SanFran/SF-Pro-Display-Medium.otf"),
    RobotoMediumItalic: require("./assets/Roboto/Roboto-MediumItalic.ttf"),
    SFMediumItalic: require("./assets/SanFran/SF-Pro-Display-MediumItalic.otf"),
    RobotoRegular: require("./assets/Roboto/Roboto-Regular.ttf"),
    SFRegular: require("./assets/SanFran/SF-Pro-Display-Regular.otf"),
    RobotoThin: require("./assets/Roboto/Roboto-Thin.ttf"),
    SFThin: require("./assets/SanFran/SF-Pro-Display-Thin.otf"),
    RobotoThinItalic: require("./assets/Roboto/Roboto-ThinItalic.ttf"),
    SFThinItalic: require("./assets/SanFran/SF-Pro-Display-ThinItalic.otf"),
  });

  // Initialization Logic
  useEffect(() => {
    async function prepare() {
      try {
        initI18n();
        await userHandler.userInit();
      } catch (error) {
        console.warn("Initialization error:", error);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  // Callback to hide splash screen once UI is ready
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  // 2. Instead of returning null, return a background-matched View
  // This keeps the screen "solid" while the handover happens.
  if (!appIsReady || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0073E6",
          alignItems: "center",
          justifyContent: "center"
        }}
      />
    );
  }

  console.log("App is ready, rendering main content.", userProfile);

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <AppContextProvider>
        <I18nextProvider i18n={i18n}>
          <NavigationIndependentTree>
            <NavigationContainer linking={linking} ref={navigationRef}>
              {userProfile ? <MapPage /> : <AuthenticationNavigator />}
            </NavigationContainer>
          </NavigationIndependentTree>
        </I18nextProvider>
      </AppContextProvider>
      <Toast config={toastConfig} visibilityTime={2000} />
    </GestureHandlerRootView>
  );
}