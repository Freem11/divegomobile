import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState, useCallback, useLayoutEffect } from "react";
import "react-native-url-polyfill/auto";
import { Dimensions, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { MapCenterContext } from "./compnents/contexts/mapCenterContext";
import { MapZoomContext } from "./compnents/contexts/mapZoomContext";
import { MapRegionContext } from "./compnents/contexts/mapRegionContext";
import { PinSpotContext } from "./compnents/contexts/pinSpotContext";
import { SessionContext } from "./compnents/contexts/sessionContext";
import MapPage from "./compnents/mapPage";
import Authentication from "./compnents/authentication/newAuthentication";
import { sessionRefresh } from "./supabaseCalls/authenticateSupabaseCalls";
import { getMostRecentPhoto } from "./supabaseCalls/photoSupabaseCalls";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppContextProvider } from "./compnents/contexts/appContextProvider";

const { width, height } = Dimensions.get("window");

export default function App() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
  const [appIsReady, setAppIsReady] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 49.246292,
    lng: -123.116226,
  });
  const [region, setRegion] = useState({
    latitude: mapCenter.lat,
    longitude: mapCenter.lng,
    latitudeDelta: 5,
    longitudeDelta: 5 * (width / height),
  });
  const [zoomlev, setZoomLev] = useState(region.latitudeDelta);
  const [dragPin, setDragPin] = useState({});

  const getCurrentLocation = async () => {
    try {
      // await requestPermissions()
      const photoLocation = await getMostRecentPhoto();
      if (photoLocation) {
        setRegion({
          ...region,
          latitude: photoLocation[0].latitude,
          longitude: photoLocation[0].longitude,
        });
        setDragPin({
          lat: photoLocation[0].latitude,
          lng: photoLocation[0].longitude,
        });
      }
    } catch (e) {
      console.log({ title: "Error65", message: e.message });
    }
  };

  let [fontsLoaded] = useFonts({
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
    SFThinItalic: require("./assets/SanFran/SF-Pro-Display-ThinItalic.otf"),
  });

  useLayoutEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      await getCurrentLocation();

      if (Platform.OS === "ios") {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }

      try {
        const asyncData = JSON.parse(await AsyncStorage.getItem("token"));
        if (asyncData === null) {
          setAppIsReady(true);
        } else {
          if (asyncData.session.refresh_token) {
            let newSession = await sessionRefresh(
              asyncData.session.refresh_token
            );
            if (newSession === null) {
              setAppIsReady(true);
            } else {
              setActiveSession(newSession);
              setAppIsReady(true);
            }
          } else {
            setAppIsReady(true);
          }
        }
      } catch (error) {
        console.log("no dice:", error.message);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
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
        <PinSpotContext.Provider value={{ dragPin, setDragPin }}>
          <MapZoomContext.Provider value={{ zoomlev, setZoomLev }}>
            <MapRegionContext.Provider value={{ region, setRegion }}>
              <MapCenterContext.Provider value={{ mapCenter, setMapCenter }}>
                <SessionContext.Provider
                  value={{ activeSession, setActiveSession }}
                >
                  {activeSession ? <MapPage /> : <Authentication />}
                </SessionContext.Provider>
              </MapCenterContext.Provider>
            </MapRegionContext.Provider>
          </MapZoomContext.Provider>
        </PinSpotContext.Provider>
      </AppContextProvider>
    </GestureHandlerRootView>
  );
}
