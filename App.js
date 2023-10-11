import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState, useCallback, useLayoutEffect } from "react";
import "react-native-url-polyfill/auto";
import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
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
import { PictureAdderContext } from "./compnents/contexts/picModalContext";
import { DSAdderContext } from "./compnents/contexts/DSModalContext";
import { SettingsContext } from "./compnents/contexts/gearModalContext";
import { PinContext } from "./compnents/contexts/staticPinContext";
import { MapCenterContext } from "./compnents/contexts/mapCenterContext";
import { MapZoomContext } from "./compnents/contexts/mapZoomContext";
import { MapBoundariesContext } from "./compnents/contexts/mapBoundariesContext";
import { MapRegionContext } from "./compnents/contexts/mapRegionContext";
import { MasterContext } from "./compnents/contexts/masterContext";
import { PinSpotContext } from "./compnents/contexts/pinSpotContext";
import { DiveSpotContext } from "./compnents/contexts/diveSpotContext";
import { SliderContext } from "./compnents/contexts/sliderContext";
import { AnimalSelectContext } from "./compnents/contexts/animalSelectContext";
import { AnimalMultiSelectContext } from "./compnents/contexts/animalMultiSelectContext";
import { PictureContext } from "./compnents/contexts/pictureContext";
import { SearchTextContext } from "./compnents/contexts/searchTextContext";
import { AnchorModalContext } from "./compnents/contexts/anchorModalContext";
import { AnchorPhotosContext } from "./compnents/contexts/anchorPhotosContext";
import { SelectedDiveSiteContext } from "./compnents/contexts/selectedDiveSiteContext";
import { SessionContext } from "./compnents/contexts/sessionContext";
import { HeatPointsContext } from "./compnents/contexts/heatPointsContext";
import { TutorialLaunchPadContext } from "./compnents/contexts/tutorialLaunchPadContext";
import { TutorialContext } from "./compnents/contexts/tutorialContext";
import { TutorialResetContext } from "./compnents/contexts/tutorialResetContext";
import { TutorialModelContext } from "./compnents/contexts/tutorialModalContext";
import { SecondTutorialModalContext } from "./compnents/contexts/secondTutorialModalContext";
import { ThirdTutorialModalContext } from "./compnents/contexts/thirdTutorialModalContext";
import { IterratorContext } from "./compnents/contexts/iterratorContext";
import { Iterrator2Context } from "./compnents/contexts/iterrator2Context";
import { Iterrator3Context } from "./compnents/contexts/iterrator3Context";
import { MapHelperContext } from "./compnents/contexts/mapHelperContext";
import { UserProfileContext } from "./compnents/contexts/userProfileContext";
import { ReverseContext } from "./compnents/contexts/reverseContext";
import { ChapterContext } from "./compnents/contexts/chapterContext";
import { AreaPicsContext } from "./compnents/contexts/areaPicsContext";
import { DevelopmentModeContext } from "./compnents/contexts/developementModeContext";
import AuthenticationPage from "./compnents/authenticationPage";
import MapPage from "./compnents/mapPage";
import { getCurrentCoordinates } from "./compnents/helpers/permissionsHelpers";
import { sessionRefresh } from "./supabaseCalls/authenticateSupabaseCalls";
import { getMostRecentPhoto } from "./supabaseCalls/photoSupabaseCalls";
import * as ScreenOrientation from 'expo-screen-orientation';

const { width, height } = Dimensions.get("window");

export default function App() {

  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)

  const [developmentMode, setDevelopmentMode] = useState(false);

  const [appIsReady, setAppIsReady] = useState(false);
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [picAdderModal, setPicAdderModal] = useState(false);
  const [diveSiteAdderModal, setDiveSiteAdderModal] = useState(false);
  const [guideModal, setGuideModal] = useState(false);
  const [secondGuideModal, setSecondGuideModal] = useState(false);
  const [thirdGuideModal, setThirdGuideModal] = useState(false);
  const [gearModal, setGearModal] = useState(false);
  const [siteModal, setSiteModal] = useState(false);
  const [tutorialLaunchpadModal, setTutorialLaunchpadModal] = useState(false);

  const [textvalue, setTextValue] = useState("");

  const [uploadedFile, setUploadedFile] = useState(null);
  const [mapHelper, setMapHelper] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [profile, setProfile] = useState([]);
  const [anchPhotos, setAnchPhotos] = useState(null);

  const [movingBack, setMovingBack] = useState(false);
  const [itterator, setItterator] = useState(null);
  const [itterator2, setItterator2] = useState(null);
  const [itterator3, setItterator3] = useState(null);
  const [tutorialRunning, setTutorialRunning] = useState(false);
  const [tutorialReset, setTutorialReset] = useState(false);
  const [chapter, setChapter] = useState(null);

  let currentMonth = new Date().getMonth() + 1;
  const [sliderVal, setSliderVal] = useState(currentMonth);
  const [newHeat, setNewHeat] = useState([]);

  const [areaPics, setAreaPics] = useState([]);

  const [pinValues, setPinValues] = useState({
    PicFile: null,
    Animal: "",
    PicDate: "",
    Latitude: "",
    Longitude: "",
    DDVal: "0",
    UserId: null,
    UserName: null,
  });

  const [addSiteVals, setAddSiteVals] = useState({
    Site: "",
    Latitude: "",
    Longitude: "",
    UserID: null,
    UserName: null,
  });

  const [selectedDiveSite, setSelectedDiveSite] = useState({
    SiteName: "",
    Latitude: "",
    Longitude: "",
  });

  const [animalSelection, setAnimalSelection] = useState("");

  const [animalMultiSelection, setAnimalMultiSelection] = useState([]);

  const [mapCenter, setMapCenter] = useState({
    lat: 49.246292,
    lng: -123.116226,
  });

  const [boundaries, setBoundaries] = useState([]);

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
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)

      // console.log("got location");
      try {
        const asyncData = JSON.parse(await AsyncStorage.getItem("token"));
        if (asyncData === null) {
          // console.log("got token?");
          setAppIsReady(true);
        } else {
          if (asyncData.session.refresh_token) {
            let newSession = await sessionRefresh(
              asyncData.session.refresh_token
            );
            if (newSession === null) {
              setAppIsReady(true);
            } else {
              // alert("at app", newSession)
              // console.log("at app", newSession)
              setActiveSession(newSession);
              setAppIsReady(true);
            }
          } else {
            setAppIsReady(true);
          }
        }
      } catch (error) {
        console.log("no dice:", error.message);
        // alert("aha!" + error.message)
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
      <DevelopmentModeContext.Provider
        value={{ developmentMode, setDevelopmentMode }}
      >
        <AreaPicsContext.Provider value={{ areaPics, setAreaPics }}>
          <SearchTextContext.Provider value={{ textvalue, setTextValue }}>
            <ChapterContext.Provider value={{ chapter, setChapter }}>
              <AnchorPhotosContext.Provider
                value={{ anchPhotos, setAnchPhotos }}
              >
                <ReverseContext.Provider value={{ movingBack, setMovingBack }}>
                  <UserProfileContext.Provider value={{ profile, setProfile }}>
                    <MapHelperContext.Provider
                      value={{ mapHelper, setMapHelper }}
                    >
                      <TutorialLaunchPadContext.Provider
                        value={{
                          tutorialLaunchpadModal,
                          setTutorialLaunchpadModal,
                        }}
                      >
                        <AnchorModalContext.Provider
                          value={{ siteModal, setSiteModal }}
                        >
                          <TutorialResetContext.Provider
                            value={{ tutorialReset, setTutorialReset }}
                          >
                            <TutorialContext.Provider
                              value={{ tutorialRunning, setTutorialRunning }}
                            >
                              <Iterrator3Context.Provider
                                value={{ itterator3, setItterator3 }}
                              >
                                <Iterrator2Context.Provider
                                  value={{ itterator2, setItterator2 }}
                                >
                                  <IterratorContext.Provider
                                    value={{ itterator, setItterator }}
                                  >
                                    <ThirdTutorialModalContext.Provider
                                      value={{
                                        thirdGuideModal,
                                        setThirdGuideModal,
                                      }}
                                    >
                                      <SecondTutorialModalContext.Provider
                                        value={{
                                          secondGuideModal,
                                          setSecondGuideModal,
                                        }}
                                      >
                                        <TutorialModelContext.Provider
                                          value={{ guideModal, setGuideModal }}
                                        >
                                          <HeatPointsContext.Provider
                                            value={{ newHeat, setNewHeat }}
                                          >
                                            <AnimalMultiSelectContext.Provider
                                              value={{
                                                animalMultiSelection,
                                                setAnimalMultiSelection,
                                              }}
                                            >
                                              <SettingsContext.Provider
                                                value={{
                                                  gearModal,
                                                  setGearModal,
                                                }}
                                              >
                                                <SelectedDiveSiteContext.Provider
                                                  value={{
                                                    selectedDiveSite,
                                                    setSelectedDiveSite,
                                                  }}
                                                >
                                                  <PictureContext.Provider
                                                    value={{
                                                      uploadedFile,
                                                      setUploadedFile,
                                                    }}
                                                  >
                                                    <SliderContext.Provider
                                                      value={{
                                                        sliderVal,
                                                        setSliderVal,
                                                      }}
                                                    >
                                                      <AnimalSelectContext.Provider
                                                        value={{
                                                          animalSelection,
                                                          setAnimalSelection,
                                                        }}
                                                      >
                                                        <DiveSpotContext.Provider
                                                          value={{
                                                            addSiteVals,
                                                            setAddSiteVals,
                                                          }}
                                                        >
                                                          <PinSpotContext.Provider
                                                            value={{
                                                              dragPin,
                                                              setDragPin,
                                                            }}
                                                          >
                                                            <MasterContext.Provider
                                                              value={{
                                                                masterSwitch,
                                                                setMasterSwitch,
                                                              }}
                                                            >
                                                              <MapZoomContext.Provider
                                                                value={{
                                                                  zoomlev,
                                                                  setZoomLev,
                                                                }}
                                                              >
                                                                <MapBoundariesContext.Provider
                                                                  value={{
                                                                    boundaries,
                                                                    setBoundaries,
                                                                  }}
                                                                >
                                                                  <MapRegionContext.Provider
                                                                    value={{
                                                                      region,
                                                                      setRegion,
                                                                    }}
                                                                  >
                                                                    <PinContext.Provider
                                                                      value={{
                                                                        pinValues,
                                                                        setPinValues,
                                                                      }}
                                                                    >
                                                                      <PictureAdderContext.Provider
                                                                        value={{
                                                                          picAdderModal,
                                                                          setPicAdderModal,
                                                                        }}
                                                                      >
                                                                        <DSAdderContext.Provider
                                                                          value={{
                                                                            diveSiteAdderModal,
                                                                            setDiveSiteAdderModal,
                                                                          }}
                                                                        >
                                                                          <MapCenterContext.Provider
                                                                            value={{
                                                                              mapCenter,
                                                                              setMapCenter,
                                                                            }}
                                                                          >
                                                                            <SessionContext.Provider
                                                                              value={{
                                                                                activeSession,
                                                                                setActiveSession,
                                                                              }}
                                                                            >
                                                                              {/* <MapPage /> */}
                                                                              {activeSession ? (
                                                                                <MapPage />
                                                                              ) : (
                                                                                <AuthenticationPage />
                                                                              )}
                                                                            </SessionContext.Provider>
                                                                          </MapCenterContext.Provider>
                                                                        </DSAdderContext.Provider>
                                                                      </PictureAdderContext.Provider>
                                                                    </PinContext.Provider>
                                                                  </MapRegionContext.Provider>
                                                                </MapBoundariesContext.Provider>
                                                              </MapZoomContext.Provider>
                                                            </MasterContext.Provider>
                                                          </PinSpotContext.Provider>
                                                        </DiveSpotContext.Provider>
                                                      </AnimalSelectContext.Provider>
                                                    </SliderContext.Provider>
                                                  </PictureContext.Provider>
                                                </SelectedDiveSiteContext.Provider>
                                              </SettingsContext.Provider>
                                            </AnimalMultiSelectContext.Provider>
                                          </HeatPointsContext.Provider>
                                        </TutorialModelContext.Provider>
                                      </SecondTutorialModalContext.Provider>
                                    </ThirdTutorialModalContext.Provider>
                                  </IterratorContext.Provider>
                                </Iterrator2Context.Provider>
                              </Iterrator3Context.Provider>
                            </TutorialContext.Provider>
                          </TutorialResetContext.Provider>
                        </AnchorModalContext.Provider>
                      </TutorialLaunchPadContext.Provider>
                    </MapHelperContext.Provider>
                  </UserProfileContext.Provider>
                </ReverseContext.Provider>
              </AnchorPhotosContext.Provider>
            </ChapterContext.Provider>
          </SearchTextContext.Provider>
        </AreaPicsContext.Provider>
      </DevelopmentModeContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
