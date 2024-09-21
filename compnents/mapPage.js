import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import { activeFonts, colors, primaryButtonAlt, buttonTextAlt } from "./styles";
import { Octicons } from "@expo/vector-icons";
import email from "react-native-email";
import Map from "./GoogleMap";
import FABMenu from "./FABMenu/bottomBarMenu";
import AnimalTopAutoSuggest from "./animalTags/animalTagContainer";
import AnimatedFullScreenModal from "../compnents/reusables/animatedFullScreenModal";
import AnimatedModalConfirmation from "../compnents/reusables/animatedModalConfimration";
import LevelOneScreen from "../compnents/reusables/levelOneScreen";
import LevelTwoScreen from "../compnents/reusables/levelTwoScreen";
import {
  grabProfileById,
  updateProfileFeeback,
} from "./../supabaseCalls/accountSupabaseCalls";
import {
  getPhotosWithUser,
  getPhotosWithUserEmpty,
} from "./../supabaseCalls/photoSupabaseCalls";
import { newGPSBoundaries } from "./helpers/mapHelpers";
import PhotoMenu from "./photoMenu/photoMenu";
import Historgram from "./histogram/histogramBody";
import PhotoFilterer from "./photoMenu/photoFilter";
import CircularButton from "../compnents/reusables/circularButton";
import { MapConfigContext } from "./contexts/mapConfigContext";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { PinSpotContext } from "./contexts/pinSpotContext";
import { PinContext } from "./contexts/staticPinContext";
import { DiveSpotContext } from "./contexts/diveSpotContext";
import { AnimalSelectContext } from "./contexts/animalSelectContext";
import { SelectedDiveSiteContext } from "./contexts/selectedDiveSiteContext";
import { MapHelperContext } from "./contexts/mapHelperContext";
import { UserProfileContext } from "./contexts/userProfileContext";
import { SessionContext } from "./contexts/sessionContext";
import { AnimalMultiSelectContext } from "./contexts/animalMultiSelectContext";
import { SearchTextContext } from "./contexts/searchTextContext";
import { AreaPicsContext } from "./contexts/areaPicsContext";
import { ModalSelectContext } from "./contexts/modalSelectContext";
import { ZoomHelperContext } from "./contexts/zoomHelperContext";
import { SitesArrayContext } from "./contexts/sitesArrayContext";
import { PullTabContext } from "./contexts/pullTabContext";
import { CarrouselTilesContext } from "./contexts/carrouselTilesContext";
import { FullScreenModalContext } from "./contexts/fullScreenModalContext";
import { LevelOneScreenContext } from "./contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "./contexts/levelTwoScreenContext";
import { ActiveScreenContext } from "./contexts/activeScreenContext";
import { ConfirmationModalContext } from "./contexts/confirmationModalContext";
import { PreviousButtonIDContext } from "./contexts/previousButtonIDContext";
import { ActiveTutorialIDContext } from "./contexts/activeTutorialIDContext";
import { scale, moderateScale, s } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";
import { useButtonPressHelper } from "./FABMenu/buttonPressHelper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  interpolate,
  withSpring,
} from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let feedbackRequest = null;
let feedbackRequest2 = null;
let FbWidth = moderateScale(350);

export default function MapPage() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
  const { mapConfig, setMapConfig } = useContext(MapConfigContext);

  const { confirmationModal, setConfirmationModal } = useContext(
    ConfirmationModalContext
  );
  const { fullScreenModal, setFullScreenModal } = useContext(
    FullScreenModalContext
  );
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { previousButtonID, setPreviousButtonID } = useContext(
    PreviousButtonIDContext
  );
  const { activeTutorialID, setActiveTutorialID } = useContext(
    ActiveTutorialIDContext
  );
  const { chosenModal, setChosenModal } = useContext(ModalSelectContext);
  const { tiles, setTiles } = useContext(CarrouselTilesContext);

  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { dragPin } = useContext(PinSpotContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { setSitesArray } = useContext(SitesArrayContext);

  const { setTextValue } = useContext(SearchTextContext);
  const { areaPics } = useContext(AreaPicsContext);
  const { setZoomHelper } = useContext(ZoomHelperContext);

  const { animalSelection } = useContext(AnimalSelectContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [anchPhotos, setAnchPhotos] = useState(null);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    filterAnchorPhotos();
  }, [selectedDiveSite]);

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      let photos;
      if (animalMultiSelection.length === 0) {
        photos = await getPhotosWithUserEmpty({
          myCreatures,
          userId: profile[0].UserID,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
      } else {
        photos = await getPhotosWithUser({
          animalMultiSelection,
          userId: profile[0].UserID,
          myCreatures,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
      }
      if (photos) {
        let count = 0;
        photos.forEach((obj) => {
          count++;
        });
        setAnchPhotos(count);
      }
    } catch (e) {
      console.log({ title: "Error66", message: e.message });
    }
  };

  const feedbackX = useSharedValue(0);

  const feedbackReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: feedbackX.value }],
    };
  });

  const startFeedbackAnimations = () => {
    if (feedbackX.value === 0) {
      feedbackX.value = withSpring(moderateScale(250));
    } else {
      feedbackX.value = withTiming(0);
    }
  };

  const [token, setToken] = useState(false);
  const [diveSitesTog, setDiveSitesTog] = useState(true);
  const [mapCenter, setMapCenter] = useState({
    lat: 49.246292,
    lng: -123.116226,
  });

  const transYtags = useSharedValue(0);

  const transTagsY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYtags.value }],
    };
  });

  const startTagAnimations = () => {
    if (transYtags.value === 0) {
      transYtags.value = -10000;
    } else {
      transYtags.value = 0;
    }
  };

  //Pull tab animations
  const pullTabHeight = useSharedValue(0);
  const { showFilterer, setShowFilterer } = useContext(PullTabContext);
  const toVal = scale(25);

  const tabPullHeigth = useDerivedValue(() => {
    return interpolate(pullTabHeight.value, [0, 1], [0, toVal]);
  });

  const tabPull = useAnimatedStyle(() => {
    return {
      height: tabPullHeigth.value,
    };
  });

  const startPullTabAnimation = () => {
    if (showFilterer) {
      pullTabHeight.value = withTiming(1);
      setIsOpen(true);

      setFullScreenModal(false);
    } else {
      Keyboard.dismiss();
      pullTabHeight.value = withTiming(0);
      setTextValue("");
      setIsOpen(false);
    }
  };

  useEffect(() => {
    startPullTabAnimation();
  }, [showFilterer]);

  const fTabY = useSharedValue(0);

  const tabFY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: fTabY.value }],
    };
  });

  const [label, setLabel] = useState("Show Menu");
  const [direction, setDirection] = useState("up");

  const startFTabAnimation = () => {
    if (fTabY.value === 0) {
      fTabY.value =
        windowWidth > 700
          ? withTiming(moderateScale(-80))
          : withTiming(moderateScale(-80));
      setLabel("Hide Menu");
      setDirection("down");
    } else {
      fTabY.value = withTiming(0);
      setLabel("Show Menu");
      setDirection("up");
    }
  };

  const onNavigate = () => {
    if (dragPin) {
      if (chosenModal === "DiveSite") {
        setAddSiteVals({
          ...addSiteVals,
          Latitude: dragPin.lat.toString(),
          Longitude: dragPin.lng.toString(),
        });
        setMapHelper(true);
        setMapConfig(0);

        setActiveScreen("DiveSiteUploadScreen");
        setLevelTwoScreen(true);
        setChosenModal(null);
      }
    }
  };

  const onShopNavigate = () => {
    setLevelOneScreen(true);
    setActiveScreen("DiveShopScreen");
    setMapHelper(true);
    setMapConfig(0);
    setZoomHelper(true);
    setSitesArray([]);
  };

  const onTripSetNavigate = () => {
    setLevelTwoScreen(true);
    setActiveScreen("TripCreatorScreen");
    setMapHelper(true);
    setMapConfig(0);
  };

  useEffect(() => {
    if (animalSelection.length > 0) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, [animalSelection]);

  useEffect(() => {
    if (areaPics.length === 0 && !isOpen) {
      pullTabHeight.value = withTiming(0);
    }
  }, [areaPics]);

  const [subButState, setSubButState] = useState(false);

  const getProfile = async () => {
    let sessionUserId = activeSession.user.id;
    // let sessionUserId = 'acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd'
    try {
      const success = await grabProfileById(sessionUserId);
      if (success) {
        let bully = success[0] && success[0].UserName;
        if (bully == null || bully === "") {
          setTimeout(() => {
            setActiveTutorialID("OnboardingX");
            setFullScreenModal(true);
          }, 500);
        } else {
          setFullScreenModal(false);
          setProfile(success);
          setPinValues({
            ...pinValues,
            UserId: success[0].UserID,
            UserName: success[0].UserName,
          });
          setAddSiteVals({
            ...addSiteVals,
            UserID: success[0].UserID,
            UserName: success[0].UserName,
          });
        }
        if (success[0].feedbackRequested === false) {
          feedbackRequest = setTimeout(() => {
            startFeedbackAnimations();
            updateProfileFeeback(success[0]);
          }, 180000);
        }
      }
    } catch (e) {
      console.log({ title: "Error43", message: "e.message" });
    }
  };

  useLayoutEffect(() => {
    setConfirmationModal(false);
    getProfile();
  }, []);

  useEffect(() => {
    setLevelOneScreen(false);
    setLevelTwoScreen(false);
    setConfirmationModal(false);
    getProfile();
  }, []);

  const handleEmail = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: "Scuba SEAsons Feedback Submission",
      body: "",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const toggleDiveSites = () => {
    setDiveSitesTog(!diveSitesTog);
    setFullScreenModal(false);
  };

  const handleMapSearchButton = () => {
    setTiles(true);
    setShowFilterer(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("SearchScreen");
    useButtonPressHelper(
      "SearchScreen",
      activeScreen,
      levelOneScreen,
      setLevelOneScreen
    );
  };

  return (
    <MapCenterContext.Provider value={{ mapCenter, setMapCenter }}>
      <DiveSitesContext.Provider value={{ diveSitesTog, setDiveSitesTog }}>
        <View style={styles.container}>
          {mapConfig in [, , 2] || !mapConfig ? (
            <View style={styles.carrousel} pointerEvents={"box-none"}>
              <PhotoMenu style={{ zIndex: 3 }} />
              <View style={styles.filterer} pointerEvents={"box-none"}>
                {((areaPics && areaPics.length > 0) || isOpen) && (
                  <View style={styles.emptyBox} pointerEvents={"box-none"}>
                    <Animated.View style={[tabPull, styles.closer]}>
                      <PhotoFilterer />
                    </Animated.View>

                    <TouchableWithoutFeedback
                      onPress={() => setShowFilterer(!showFilterer)}
                    >
                      <View style={styles.pullTab}></View>
                    </TouchableWithoutFeedback>
                  </View>
                )}

                <View style={styles.animalSelect} pointerEvents={"box-none"}>
                  <AnimalTopAutoSuggest transTagsY={transTagsY} />
                </View>
              </View>
            </View>
          ) : null}

          {mapConfig in [, , 2] || !mapConfig ? (
            <TouchableWithoutFeedback onPress={startTagAnimations}>
              <AntDesign
                name="tags"
                color="#355D71"
                size={24}
                style={{ position: "absolute", left: "87.5%", top: "13%" }}
              />
            </TouchableWithoutFeedback>
          ) : null}

          {mapConfig === 0 ? (
            <View style={styles.FMenuAnimate} pointerEvents={"box-none"}>
              <Animated.View style={[styles.feedback, feedbackReveal]}>
                <Text style={styles.feedRequest} onPress={() => handleEmail()}>
                  Send Scuba SEAsons feedback
                </Text>
                <TouchableWithoutFeedback
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(23),
                    marginTop: moderateScale(3),
                  }}
                  onPress={startFeedbackAnimations}
                >
                  <Octicons
                    name="paper-airplane"
                    size={moderateScale(24)}
                    color="white"
                    style={{ marginTop: moderateScale(3) }}
                  />
                </TouchableWithoutFeedback>
              </Animated.View>

              <View style={styles.FMenu}>
                <FABMenu
                  style={{ zIndex: 2 }}
                  toggleDiveSites={toggleDiveSites}
                />
              </View>
            </View>
          ) : null}

          <View 
          pointerEvents={'box-none'}
          style={{
                  position: "absolute",
                  bottom: moderateScale(35),
                  width: "80%",
                  alignItems: "center",
                  justifyContent: 'center',
                  flexDirection: "row",
                  zIndex: 2,
                }}>
            {mapConfig in [, 1, , 3] ? (
              <View
                style={{
                  zIndex: 2,
                  marginRight: "10%"
                }}
              >
                <CircularButton
                  buttonAction={handleMapSearchButton}
                  icon="compass"
                />
              </View>
            ) : null}

            {mapConfig in [, 1, 2, 3] ? (
              <TouchableWithoutFeedback
                onPress={
                  mapConfig === 1
                    ? onNavigate
                    : mapConfig === 2
                    ? onShopNavigate
                    : mapConfig === 3
                    ? onTripSetNavigate
                    : null
                }
              >
                <View style={styles.lowerButtonWrapper}>
                  <Text style={styles.lowerButtonText}>
                    {mapConfig === 1
                      ? "Set Pin"
                      : mapConfig === 2
                      ? "Return to Shop"
                      : mapConfig === 3
                      ? "Sites Complete"
                      : null}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>


          {mapConfig === 0  && animalMultiSelection.length > 0 ? (
              <View style={styles.Hist} pointerEvents={"none"}>
                <Historgram style={{ zIndex: 2 }} />
              </View>
            ) : null}

          <LevelOneScreen />
          <LevelTwoScreen />
          <AnimatedFullScreenModal />
          <AnimatedModalConfirmation />

          <Map style={{ zIndex: 1 }} />
        </View>
      </DiveSitesContext.Provider>
    </MapCenterContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  animalSelect: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    zIndex: 1,
    // backgroundColor: "pink"
  },
  FMenuAnimate: {
    position: "absolute",
    bottom: moderateScale(15),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    zIndex: 3,
    // backgroundColor: 'pink'
  },
  FBox: {
    alignItems: "center",
    paddingBottom: "2%",
  },
  FText: {
    color: colors.themeWhite,
    fontFamily: activeFonts.Bold,
    fontSize: moderateScale(15),
  },
  FMenu: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryBlue,
    width: "100%",
    height: moderateScale(65),
    zIndex: 3,
  },
  lowerButtonWrapper: [
    primaryButtonAlt,
    {
      alignItems: "center",
      textAlign: "center",
      zIndex: 2,
    },
  ],
  lowerButtonText: buttonTextAlt,
  PinButtonPressed: {
    position: "absolute",
    alignItems: "center",
    textAlign: "center",
    bottom: scale(28),
    backgroundColor: "#538DBD",
    borderRadius: scale(10),
    marginBottom: 0,
    width: "50%",
    height: scale(30),
    zIndex: 2,
    paddingTop: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,

    elevation: 10,
  },
  carrousel: {
    position: "absolute",
    flexDirection: "column",
    alignContent: "center",
    // backgroundColor: "blue",
    height: 105,
    top:
      windowWidth > 700
        ? moderateScale(12)
        : moderateScale(40),
    zIndex: 3,
  },
  filterer: {
    flex: 1,
    alignSelf: "center",
    flexDirection: "column",
    position: "absolute",
    flexDirection: "column",
    width: "50%",
    top: moderateScale(105),
    zIndex: 3,
    // backgroundColor: "green"
  },
  emptyBox: {
    alignSelf: "center",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    zIndex: 3,
    // backgroundColor: "grey"
  },
  Hist: {
    alignItems: "center",
    position: "absolute",
    bottom: scale(70),
    left: scale(75),
    width: scale(190),
    height: 100,
    zIndex: 2,
    borderRadius: 15,
    opacity: 0.8,
    backgroundColor: "transparent",
  },
  pullTab: {
    height: windowWidth > 600 ? scale(10) : scale(15),
    width: windowWidth > 600 ? scale(80) : scale(100),
    backgroundColor: colors.secondaryYellow,
    borderBottomRightRadius: scale(7),
    borderBottomLeftRadius: scale(7),
    zIndex: 10,
  },
  closer: {
    zIndex: 5,
  },
  feedback: {
    zIndex: 20,
    flexDirection: "row",
    backgroundColor: colors.primaryBlue,
    position: "absolute",
    top: -moderateScale(60),
    left: -0.88 * FbWidth,
    padding: moderateScale(5),
    borderTopRightRadius: moderateScale(15),
    borderBottomRightRadius: moderateScale(15),
    width: windowWidth > 600 ? FbWidth + moderateScale(20) : FbWidth,
    height: moderateScale(39),
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    elevation: 10,
  },
  feedRequest: {
    color: colors.themeWhite,
    fontFamily: activeFonts.ThinItalic,
    fontSize: moderateScale(18),
    marginTop: moderateScale(3),
    marginRight: moderateScale(10),
    marginLeft: moderateScale(14),
    paddingLeft: moderateScale(50),
  },
});
