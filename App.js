import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState, useCallback, useLayoutEffect } from "react";
import "react-native-url-polyfill/auto";
import { StyleSheet, Dimensions, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Roboto_700Bold } from "@expo-google-fonts/roboto";
import { PermanentMarker_400Regular } from "@expo-google-fonts/permanent-marker";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { PatrickHand_400Regular } from "@expo-google-fonts/patrick-hand";
import {
  Caveat_400Regular,
  Caveat_500Medium,
  Caveat_600SemiBold,
  Caveat_700Bold,
} from "@expo-google-fonts/caveat";
import { MapCenterContext } from "./compnents/contexts/mapCenterContext";
import { MapZoomContext } from "./compnents/contexts/mapZoomContext";
import { MapRegionContext } from "./compnents/contexts/mapRegionContext";
import { PinSpotContext } from "./compnents/contexts/pinSpotContext";
import { SessionContext } from "./compnents/contexts/sessionContext";
import { MyCreaturesContext } from "./compnents/contexts/myCreaturesContext";
import { MyDiveSitesContext } from "./compnents/contexts/myDiveSitesContext";
import AuthenticationPage from "./compnents/authenticationPage";
import MapPage from "./compnents/mapPage";
import { sessionRefresh } from "./supabaseCalls/authenticateSupabaseCalls";
import { getMostRecentPhoto } from "./supabaseCalls/photoSupabaseCalls";
import * as ScreenOrientation from "expo-screen-orientation";
import config from "./config";
import { AppContextProvider } from "./compnents/contexts/appContextProvider";
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import { grabProfileById, updatePushToken } from "./supabaseCalls/accountSupabaseCalls";

const { width, height } = Dimensions.get("window");

export default function App() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  const [appIsReady, setAppIsReady] = useState(false);
  const [myDiveSites, setMyDiveSites] = useState("");
  const [myCreatures, setMyCreatures] = useState("");
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

  // Oahu -21.281493, -157.885560
  // Cozumel - 20.334094, -87.030347
  // Hawaii - 19.736754, -156.063195
  // campbell river - 50.064541, -125.245750

  async function findPlaces() {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?location=50.064541,-125.245750&query=['dive_site','reef']&radius=1&type=tourist_attraction&key=${config.GOOGLE_MAPS_API_KEY}`
      );
      const placeInfo = await res.json();

      if (placeInfo) {
        return placeInfo.results;
      }
    } catch (err) {
      console.log("error", err);
    }
  }

  async function getPlaceDetails(place) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&&key=${config.GOOGLE_MAPS_API_KEY}`
      );
      const placeDetails = await res.json();
      const result = placeDetails.result;

      const placeName = result.name;
      const placeLocation = result.geometry.location;

      if (result.photos) {
        const photos = place.photos;
        photos.forEach((photo) => {
          getPhotoDetails(photo, placeName, placeLocation);
        });
      }
    } catch (err) {
      console.log("error", err);
    }
  }

  async function getPhotoDetails(photo, placeName, placeLocation) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${config.GOOGLE_MAPS_API_KEY}`
      );

      console.log("---------------- photo details ---------------");
      console.log("placeName: ", placeName);
      console.log("placeLocation: ", placeLocation);
      console.log("contributorLink: ", photo.html_attributions[0]);

      console.log("photoUrl: ", res.url);
    } catch (err) {
      console.log("error", err);
    }
  }

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
      console.log({ title: "Error", message: e.message });
    }
  };

  let [fontsLoaded] = useFonts({
    PermanentMarker_400Regular,
    Caveat_400Regular,
    Caveat_500Medium,
    Caveat_600SemiBold,
    Caveat_700Bold,
    Roboto_700Bold,
    Itim_400Regular,
    PatrickHand_400Regular,
    GothamBlack: require("./assets/Gotham-Black.otf"),
    GothamBold: require("./assets/Gotham-Bold.otf"),
    SanFran: require("./assets/SFNSText-RegularG1.otf"),
    SanFranSemi: require("./assets/SFNSText-Semibold.otf"),
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
        const diveSitesData = JSON.parse(
          await AsyncStorage.getItem("myDiveSites")
        );
        const creaturesData = JSON.parse(
          await AsyncStorage.getItem("myCreatures")
        );
        console.log(diveSitesData, creaturesData);
        if (diveSitesData) {
          setMyDiveSites(diveSitesData);
        }
        if (creaturesData) {
          setMyCreatures(creaturesData);
        }

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
              registerForPushNotificationsAsync(newSession);
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

  const registerForPushNotificationsAsync = async (session) => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
    return;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync({
      'projectId': Constants.expoConfig.extra.eas.projectId,
    })).data;

    if (session && session.user) {
      console.log("yes")
      const user = (await grabProfileById(session.user.id));
      const activeToken = user[0].expo_push_token;

      if (activeToken === null || !activeToken.includes(token)) {
        updatePushToken({ token: activeToken ? [...activeToken, token] : [token], UserID: session.user.id })
      }
    } else {
      console.log("no")
    }
  };

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
        <MyCreaturesContext.Provider value={{ myCreatures, setMyCreatures }}>
          <MyDiveSitesContext.Provider value={{ myDiveSites, setMyDiveSites }}>
            <PinSpotContext.Provider value={{ dragPin, setDragPin }}>
              <MapZoomContext.Provider value={{ zoomlev, setZoomLev }}>
                <MapRegionContext.Provider value={{ region, setRegion }}>
                  <MapCenterContext.Provider value={{ mapCenter, setMapCenter }}>
                    <SessionContext.Provider value={{ activeSession, setActiveSession }}>
                      {activeSession ? (
                        <MapPage />
                      ) : (
                        <AuthenticationPage />
                      )}
                    </SessionContext.Provider>
                  </MapCenterContext.Provider>
                </MapRegionContext.Provider>
              </MapZoomContext.Provider>
            </PinSpotContext.Provider>
          </MyDiveSitesContext.Provider>
        </MyCreaturesContext.Provider>
      </AppContextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
