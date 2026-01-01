import React, { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { I18nextProvider } from "react-i18next";
import Toast from "react-native-toast-message";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "web-streams-polyfill";
import { Platform } from "react-native";
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

export const navigationRef = createNavigationContainerRef<any>();

export default function App() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  const [appIsReady, setAppIsReady] = useState(false);
  const { userProfile } = useUserProfile();
  const userHandler = useUserHandler();

  const linking = {
    prefixes: ["scubaseasons://"],
    config: {
      screens: {},
    },
    subscribe(listener: (url: string) => void) {
      const onReceiveURL = async ({ url }: { url: string }) => {
        console.log("Incoming Deep Link:", url);

        if (url.startsWith(resetPasswordURL) && url.includes("type=recovery")) {
          console.log("Processing Recovery Link...");

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

  /* eslint-disable @typescript-eslint/no-require-imports */
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
  /* eslint-enable @typescript-eslint/no-require-imports */

  useEffect(() => {
    initI18n();
  }, []);

  useLayoutEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();

      try {
        await userHandler.userInit();
      } catch (error: any) {
        console.log("Initialization error:", error.message);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <AppContextProvider>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer linking={linking} ref={navigationRef}>
            {userProfile ? (
              <MapPage />
            ) : (
              <AuthenticationNavigator />
            )}
          </NavigationContainer>
        </I18nextProvider>
      </AppContextProvider>
      <Toast config={toastConfig} visibilityTime={2000} />
    </GestureHandlerRootView>
  );
}