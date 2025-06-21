import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { activeFonts, colors, primaryButtonAlt, buttonTextAlt } from "./styles";
import email from "react-native-email";
import GoogleMap from "./googleMap";
import BottomMenu from './reusables/bottomMenu';
import ProfileButton from './FABMenu/profileButton'
import SiteSearchButton from './FABMenu/siteSearchButton'
import DiveSiteButton from './FABMenu/diveSiteButton'
import GuidesButton from './FABMenu/guidesButton'
import ItineraryListButton from "./FABMenu/itineraryCreatorButton"
import AnimalTopAutoSuggest from "./animalTags/animalTagContainer";
import AnimatedFullScreenModal from "../compnents/reusables/animatedFullScreenModal";
import AnimatedModalConfirmation from "../compnents/reusables/animatedModalConfimration";
import LevelOneScreen from "../compnents/reusables/levelOneScreen";
import LevelTwoScreen from "../compnents/reusables/levelTwoScreen";
import {
  grabProfileByUserId,
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
import { scale, moderateScale } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";
import BottomDrawer from './screens/bottomDrawer/animatedBottomDrawer';

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
import { useMapStore } from "./googleMap/useMapStore";
import { useActiveScreenStore } from '../store/useActiveScreenStore';
import { EmailFeedback } from "./feed/emailFeedback";
import { FeedsButton } from "./feed/iconButton";
import FeedScreens from "./feed/screens";
import { useTranslation } from "react-i18next";
import SearchTool from './searchTool';
import { windowHeight } from "./authentication/styles";

const windowWidth = Dimensions.get("window").width;
let feedbackRequest = null;
let FbWidth = moderateScale(350);

export default function MapPage() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
  const shopId = useMapStore((state) => state.itemId);
  const mapConfig = useMapStore((state) => state.mapConfig);
  const setActiveScreen2 = useActiveScreenStore((state) => state.setActiveScreen);
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);

  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { chosenModal, setChosenModal } = useContext(ModalSelectContext);
  const { setTiles } = useContext(CarrouselTilesContext);
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

  const { t } = useTranslation();

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
      const success = await grabProfileByUserId(sessionUserId);
      if (success) {
        let bully = success && success.UserName;
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

  const PARTNER_ACCOUNT_STATUS =
  (profile?.partnerAccount) || false;

  return (
    <MapCenterContext.Provider value={{ mapCenter, setMapCenter }}>
      <DiveSitesContext.Provider value={{ diveSitesTog, setDiveSitesTog }}>

          <View style={styles.container}>

          <SafeAreaView style={styles.searchBox}>
          <SearchTool/>
      
          </SafeAreaView>

            {mapConfig in [, , 2] || !mapConfig ? (
              <View style={styles.carrousel} pointerEvents={"box-none"}>


                     {/* <View style={styles.emptyBox} pointerEvents={"box-none"}>
                       <Animated.View style={[tabPull, styles.closer]}>
                         <PhotoFilterer />
                       </Animated.View>

                       <TouchableWithoutFeedback
                         onPress={() => setShowFilterer(!showFilterer)}
                       >
                         <View style={styles.pullTab}></View>
                       </TouchableWithoutFeedback>
                     </View> */}

                  <View style={styles.animalSelect} pointerEvents={"box-none"}>
                    <AnimalTopAutoSuggest transTagsY={transTagsY} />
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

            {mapConfig === 0 && <EmailFeedback />}
            {/* {mapConfig === 0 && <FeedsButton />} */}


            {mapConfig === 0 ?
            <View style={{position: 'absolute', bottom: 0, width: '100%', zIndex: 3}}> 
             <BottomDrawer/> 
              <BottomMenu>
                <ProfileButton />
                <SiteSearchButton />
                <CircularButton buttonAction={toggleDiveSites} icon="anchor" />
                <DiveSiteButton />
                {PARTNER_ACCOUNT_STATUS ? <ItineraryListButton /> : <GuidesButton />}
              </BottomMenu>     
          
               </View>
              : null}

            <FeedScreens />
            <LevelOneScreen />
            <LevelTwoScreen />
            <AnimatedFullScreenModal />
            <AnimatedModalConfirmation />

            <GoogleMap style={{ zIndex: 1 }} />
          </View>
      
      </DiveSitesContext.Provider>
    </MapCenterContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  searchBox: {
    zIndex: 20,
    position: 'absolute',
    top: moderateScale(0),
    width: windowWidth,
    // backgroundColor: colors.themeWhite,
    pointerEvents: 'box-none'
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
    bottom: Platform.OS === "ios" ? moderateScale(15) : moderateScale(0),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    zIndex: 3,
    // backgroundColor: 'pink'
  },
  FMenu: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryBlue,
    width: "100%",
    height: moderateScale(65),
    zIndex: 3
  },
  iosBottom: {
    position: 'absolute',
    bottom: 0,
    height: Platform.OS === "ios" ? moderateScale(15) : 0,
    width: "100%",
    backgroundColor: colors.primaryBlue,
    zIndex: 3
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
  carrousel: {
    position: "absolute",
    flexDirection: "column",
    alignContent: "center",
    // backgroundColor: "blue",
    height: 105,
    top: windowWidth > 700 ? moderateScale(12) : Platform.OS === 'android' ? moderateScale(30) : moderateScale(50),
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
    top: -moderateScale(130),
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
