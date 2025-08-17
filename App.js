import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect
} from "react";
import "react-native-url-polyfill/auto";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import * as ScreenOrientation from "expo-screen-orientation";
import { I18nextProvider } from "react-i18next";

import { SessionContext } from "./compnents/contexts/sessionContext";
import MapPage from "./compnents/mapPage/mapPage";
import Authentication from "./compnents/authentication";
import { sessionRefresh } from "./supabaseCalls/authenticateSupabaseCalls";
import { AppContextProvider } from "./compnents/contexts/appContextProvider";
import { i18n, initI18n } from "./i18n";
import { toastConfig } from "./compnents/toast";
import { useUserProfileStore } from "./store/useUserProfileStore";

export default function App() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
  const [appIsReady, setAppIsReady] = useState(false);
  const userProfileAction = useUserProfileStore(state => state.actions);
  const userProfile = useUserProfileStore(state => state.profile);

  const [fontsLoaded] = useFonts({
    RobotoBlack: require("./assets/Roboto/Roboto-Black.ttf"),
    SFBlack: require("./assets/SanFran/SF-Pro-Display-Black.otf"),
    RobotoBlackItalic: require("./assets/Roboto/Roboto-BlackItalic.ttf"),
    SFBlackItalic: require("./assets/SanFran/SF-Pro-Display-BlackItalic.otf"),
    RobotoBold: require("./assets/Roboto/Roboto-Bold.ttf"),
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
    SFThinItalic: require("./assets/SanFran/SF-Pro-Display-ThinItalic.otf")
  });

  useEffect(() => {
    initI18n();
  }, []);

  useLayoutEffect(() => {
    const prepare = async() => {
      await SplashScreen.preventAutoHideAsync();

      if (Platform.OS === "ios") {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }

      try {

        userProfileAction.initProfile();
      } catch (error) {
        console.log("no dice:", error.message);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async() => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <AppContextProvider>

        <I18nextProvider i18n={i18n}>
          {userProfile ? <MapPage /> : <Authentication />}
        </I18nextProvider>
      </AppContextProvider>
      <Toast config={toastConfig} visibilityTime={2000} />
      {/* <Toast /> */}
    </GestureHandlerRootView>
  );
}
