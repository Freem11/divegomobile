import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from "expo-constants";
// import Device from "expo-device";
import Map from "./GoogleMap";
import FABButtons from "./FABset";
import Logo from "./logo/logoButton";
import AnimalTopAutoSuggest from "./animalTags/animalTagContainer";
import { grabProfileById } from "./../supabaseCalls/accountSupabaseCalls";
import { getPhotosforAnchorMulti } from "./../supabaseCalls/photoSupabaseCalls";
import { userCheck } from "./../supabaseCalls/authenticateSupabaseCalls";
import { newGPSBoundaries } from "./helpers/mapHelpers";
import PhotoMenu from "./photoMenu/photoMenu";
import Historgram from "./histogram/histogramBody";
import PhotoFilterer from "./photoMenu/photoFilter";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { PictureAdderContext } from "./contexts/picModalContext";
import { MasterContext } from "./contexts/masterContext";
import { PinSpotContext } from "./contexts/pinSpotContext";
import { PinContext } from "./contexts/staticPinContext";
import { DiveSpotContext } from "./contexts/diveSpotContext";
import { AnimalSelectContext } from "./contexts/animalSelectContext";
import { MonthSelectContext } from "./contexts/monthSelectContext";
import { TutorialModelContext } from "./contexts/tutorialModalContext";
import { ChapterContext } from "./contexts/chapterContext";
import { SecondTutorialModalContext } from "./contexts/secondTutorialModalContext";
import { ThirdTutorialModalContext } from "./contexts/thirdTutorialModalContext";
import { TutorialLaunchPadContext } from "./contexts/tutorialLaunchPadContext";
import { SelectedDiveSiteContext } from "./contexts/selectedDiveSiteContext";
import { AnchorModalContext } from "./contexts/anchorModalContext";
import { DSAdderContext } from "./contexts/DSModalContext";
import { IterratorContext } from "./contexts/iterratorContext";
import { Iterrator2Context } from "./contexts/iterrator2Context";
import { Iterrator3Context } from "./contexts/iterrator3Context";
import { MapHelperContext } from "./contexts/mapHelperContext";
import { UserProfileContext } from "./contexts/userProfileContext";
import { SessionContext } from "./contexts/sessionContext";
import { TutorialContext } from "./contexts/tutorialContext";
import { AnimalMultiSelectContext } from "./contexts/animalMultiSelectContext";
import { SearchTextContext } from "./contexts/searchTextContext";
import { AreaPicsContext } from "./contexts/areaPicsContext";
import { ModalSelectContext } from "./contexts/modalSelectContext";

import { scale } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import TutorialLaunchPadModal from "./modals/tutorialsModal";
import AnchorModal from "./modals/anchorModal";
import DiveSiteModal from "./modals/diveSiteAdderModal";
import PicUploadModal from "./modals/picUploaderModal";
import IntroTutorial from "./tutorial/introTutorial";
import SecondTutorial from "./tutorial/secondTutorial";
import ThirdTutorial from "./tutorial/thirdTutorial";
import TutorialBar from "./tutorialBar/tutorialBarContainer";
import UserProfileModal from "./modals/userProfileModal";

import * as ScreenOrientation from 'expo-screen-orientation';
import { ProfileModalContext } from "./contexts/profileModalContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function MapPage() {
  
  if(Platform.OS ==="ios"){
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  }
  
  const { chosenModal, setChosenModal } = useContext(ModalSelectContext);

  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { masterSwitch, setMasterSwitch } = useContext(MasterContext);
  const { dragPin } = useContext(PinSpotContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);

  const { textvalue, setTextValue } = useContext(SearchTextContext);
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);

  const { animalSelection } = useContext(AnimalSelectContext);
  const [monthVal, setMonthVal] = useState("");
  const { mapHelper, setMapHelper } = useContext(MapHelperContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);
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
      const photos = await getPhotosforAnchorMulti({
        animalMultiSelection,
        // sliderVal,
        minLat,
        maxLat,
        minLng,
        maxLng,
      });
      if (photos) {
        let count = 0;
        photos.forEach((obj) => {
          count++;
        });
        setAnchPhotos(count);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  //Tutorial Launch Pad Model Animation
  const tutorialLaunchpadModalY = useSharedValue(windowHeight);
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );

  const tutorialLaunchpadModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorialLaunchpadModalY.value }],
    };
  });

  const startTutorialLaunchPadModalAnimations = () => {
    if (tutorialLaunchpadModal) {
      tutorialLaunchpadModalY.value = withTiming(0, {duration: 150, easing: Easing.out(Easing.linear)});
    } else {
      tutorialLaunchpadModalY.value = withTiming(windowHeight, {duration: 150, easing: Easing.out(Easing.linear)});
    }
  };

  useEffect(() => {
    startTutorialLaunchPadModalAnimations();
    // if (!itterator && guideModal) {
    //   setItterator(0);
    // }
  }, [tutorialLaunchpadModal]);

  //Anchor Modal Animation
  const anchorModalY = useSharedValue(windowHeight);
  const { siteModal, setSiteModal } = useContext(AnchorModalContext);
  const { selectedDiveSite, setSelectedDiveSite } = useContext(
    SelectedDiveSiteContext
  );

  const anchorModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: anchorModalY.value }],
    };
  });

  const startAnchorModalAnimations = () => {
    if (siteModal) {
      anchorModalY.value = withTiming(0, {duration: 150, easing: Easing.out(Easing.linear)});
    } else {
      anchorModalY.value = withTiming(windowHeight, {duration: 150, easing: Easing.out(Easing.linear)});
    }
  };

  useEffect(() => {
    startAnchorModalAnimations();

    // const filterAnchorPhotos = async () => {
    //   let { minLat, maxLat, minLng, maxLng } =  newGPSBoundaries(
    //     selectedDiveSite.Latitude,
    //     selectedDiveSite.Longitude
    //   );
    // }

    // filterAnchorPhotos();
   
    if (tutorialRunning && siteModal) {
      if (itterator > 0 && itterator !== 11 && itterator !== 20) {
        setItterator(itterator + 1);
      } else if (itterator === 11 && anchPhotos === 0 ) {
        setItterator(itterator + 1);
      } else if ((itterator === 18 || itterator === 11) && anchPhotos > 0 ) {
        setItterator(itterator + 2);
      }
    }
    // setChapter(null)
  }, [siteModal]);

  //Dive Site Modal Animation
  const diveSiteModalY = useSharedValue(windowHeight);
  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );

  const diveSiteModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: diveSiteModalY.value }],
    };
  });

  const startDiveSiteModalAnimations = () => {
    if (diveSiteAdderModal) {
      diveSiteModalY.value = withTiming(0, {duration: 150, easing: Easing.out(Easing.linear)});
    } else {
      diveSiteModalY.value = withTiming(windowHeight, {duration: 150, easing: Easing.out(Easing.linear)});
    }
  };

  useEffect(() => {
    startDiveSiteModalAnimations();
    // if (itterator > 0){
    //   setItterator(itterator + 1);
    // }
  }, [diveSiteAdderModal]);

  //Picture Adder Modal
  const pictureModalY = useSharedValue(windowHeight);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

  const pictureModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: pictureModalY.value }],
    };
  });

  const startPictureModalAnimations = () => {
    if (picAdderModal) {
      pictureModalY.value = withTiming(0, {duration: 150, easing: Easing.out(Easing.linear)});
    } else {
      pictureModalY.value = withTiming(windowHeight, {duration: 150, easing: Easing.out(Easing.linear)});
    }
  };

  useEffect(() => {
    startPictureModalAnimations();
    // if (itterator > 0){
    //   setItterator(itterator + 1);
    // }
  }, [picAdderModal]);

  //Intro Tutorial Animations
  const tutorialModalY = useSharedValue(windowHeight);
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { itterator, setItterator } = useContext(IterratorContext);

  const tutorialModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorialModalY.value }],
    };
  });

  const startGuideModalAnimations = () => {
    if (guideModal) {
      tutorialModalY.value = withTiming(0, {duration: 150, easing: Easing.out(Easing.linear)});
    } else {
      tutorialModalY.value = withTiming(windowHeight, {duration: 150, easing: Easing.out(Easing.linear)});
    }
  };

  useEffect(() => {
    startGuideModalAnimations();
    // if (!itterator && guideModal) {
    //   setItterator(0);
    // }
  }, [guideModal]);

  //Second Tutorial Animations
  const tutorial2ModalY = useSharedValue(windowHeight);
  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);

  const tutorial2ModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorial2ModalY.value }],
    };
  });

  const startSecondGuideModalAnimations = () => {
    if (secondGuideModal) {
      tutorial2ModalY.value = withTiming(0, {duration: 150, easing: Easing.out(Easing.linear)});
    } else {
      tutorial2ModalY.value = withTiming(windowHeight, {duration: 150, easing: Easing.out(Easing.linear)});
    }
  };

  useEffect(() => {
    startSecondGuideModalAnimations();
    // if (!itterator && guideModal) {
    //   setItterator(0);
    // }
  }, [secondGuideModal]);

  //Third Tutorial Animations
  const tutorial3ModalY = useSharedValue(windowHeight);
  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);

  const tutorial3ModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorial3ModalY.value }],
    };
  });

  const startThirdGuideModalAnimations = () => {
    if (thirdGuideModal) {
      tutorial3ModalY.value = withTiming(0, {duration: 150, easing: Easing.out(Easing.linear)});
    } else {
      tutorial3ModalY.value = withTiming(windowHeight, {duration: 150, easing: Easing.out(Easing.linear)});
    }
  };

  useEffect(() => {
    startThirdGuideModalAnimations();
    // if (!itterator && guideModal) {
    //   setItterator(0);
    // }
  }, [thirdGuideModal]);

  //Profile Modal Animation
    const profileModalY = useSharedValue(windowHeight);
    const { profileModal, setProfileModal } = useContext(ProfileModalContext);
  
    const profileModalReveal = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: profileModalY.value }],
      };
    });
  
    const startProfileModalAnimations = () => {
      if (profileModal) {
        profileModalY.value = withTiming(0, {duration: 150, easing: Easing.out(Easing.linear)});
      } else {
        profileModalY.value = withTiming(windowHeight, {duration: 150, easing: Easing.out(Easing.linear)});
      }
    };
    
    useEffect(() => {
      startProfileModalAnimations();
      // if (!itterator && guideModal) {
      //   setItterator(0);
      // }
    }, [profileModal]);



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

  const pullTabHeight = useSharedValue(0);

  const toVal = scale(25)

  const tabPullHeigth = useDerivedValue(() => {
    return interpolate(pullTabHeight.value, [0, 1], [0, toVal]);
  });

  const tabPull = useAnimatedStyle(() => {
    return {
      height: tabPullHeigth.value,
    };
  });

  const startPullTabAnimation = () => {
    if (pullTabHeight.value === 0) {
      pullTabHeight.value = withTiming(1);
      setIsOpen(true)
    } else {
      Keyboard.dismiss()
      pullTabHeight.value = withTiming(0);
      setTextValue("");
      setIsOpen(false)
    }
  };

  const onNavigate = () => {

    if (chosenModal === "DiveSite"){
      setAddSiteVals({
        ...addSiteVals,
        Latitude: dragPin.lat.toString(),
        Longitude: dragPin.lng.toString(),
      });
      setMapHelper(true);
      setMasterSwitch(true);
      setDiveSiteAdderModal(!diveSiteAdderModal)
      setItterator2(itterator2 + 1)
      setChosenModal(null);
    } else if (chosenModal === "Photos") {
      setPinValues({
        ...pinValues,
        Latitude: dragPin.lat.toString(),
        Longitude: dragPin.lng.toString(),
      });
      setMapHelper(true);
      setMasterSwitch(true);
      setPicAdderModal(!picAdderModal);
      setChosenModal(null);
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
    if (areaPics.length === 0 && !isOpen){
      pullTabHeight.value = withTiming(0)
    }
 
  }, [areaPics]);

  const [subButState, setSubButState] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      let sessionUserId = activeSession.user.id;
      // let sessionUserId = 'acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd'
      try {
        const success = await grabProfileById(sessionUserId);
        if (success) {
          let bully = success[0].UserName;
          if (bully == null || bully === "") {
            setGuideModal(true);
            setTutorialRunning(true);
            setItterator(0);
          } else {
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
        }
      } catch (e) {
        console.log({ title: "Error", message: "e.message" });
      }
    };

    getProfile();
  }, []);

  return (
    <MonthSelectContext.Provider value={{ monthVal, setMonthVal }}>
      <MapCenterContext.Provider value={{ mapCenter, setMapCenter }}>
        <DiveSitesContext.Provider value={{ diveSitesTog, setDiveSitesTog }}>
          <View style={styles.container}>
            {tutorialRunning && (
              <View style={styles.tutorialBar}>
                <TutorialBar style={{ zIndex: 55 }} />
              </View>
            )}

            {masterSwitch && (
              <View style={styles.carrousel} pointerEvents={"box-none"}>
                <PhotoMenu style={{ zIndex: 3 }} />
                   <View style={styles.filterer} pointerEvents={"box-none"}>
                {(areaPics && areaPics.length > 0 || isOpen) && (
                  <View style={styles.emptyBox} pointerEvents={"box-none"}>
                  <Animated.View style={[tabPull, styles.closer]}>
                  <PhotoFilterer />
                </Animated.View>
             
                <TouchableWithoutFeedback onPress={startPullTabAnimation}>
                  <View style={styles.pullTab}></View>
                </TouchableWithoutFeedback>
                </View>
   )}


   
                <View style={styles.animalSelect} pointerEvents={"box-none"}>
                  <AnimalTopAutoSuggest transTagsY={transTagsY} />
                </View>
              </View>
              </View>
              
            )}
{/* 
           {masterSwitch && ( 
               <KeyboardAvoidingView behavior="height" enabled={false}>
           
               </KeyboardAvoidingView>
           )} */}

            {masterSwitch && (
              <TouchableWithoutFeedback onPress={startTagAnimations}>
                <AntDesign
                  name="tags"
                  color="#355D71"
                  size={24}
                  style={{ position: "absolute", left: "87.5%", top: "13%" }}
                />
              </TouchableWithoutFeedback>
            )}

            {masterSwitch && (
              <View style={styles.Fbuttons}>
                <FABButtons style={{ zIndex: 2 }} />
              </View>
            )}

            {!masterSwitch && (
              <View
                style={subButState ? styles.PinButtonPressed : styles.PinButton}
              >
                <TouchableOpacity
                  style={{
                    // backgroundColor: "orange",
                    width: scale(200),
                    height: scale(30),
                  }}
                  onPress={onNavigate}
                  onPressIn={() => setSubButState(true)}
                  onPressOut={() => setSubButState(false)}
                >
                  <Text
                    style={{
                      color: "gold",
                      fontFamily: "PatrickHand_400Regular",
                      fontSize: scale(22),
                      width: "100%",
                      height: "120%",
                      textAlign: "center",
                      marginTop: -5,
                      borderRadius: scale(15),
                    }}
                  >
                    Set Pin
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {masterSwitch && (
              <View style={styles.Hist} pointerEvents={"none"}>
                <Historgram style={{ zIndex: 2 }} />
              </View>
            )}

            <Logo style={styles.Logo} pointerEvents={"none"} />

            {/* modals go here? */}
            <Animated.View
              style={[styles.anchorModal, tutorialLaunchpadModalReveal]}
            >
              <TutorialLaunchPadModal
                tutorialLaunchpadModalY={tutorialLaunchpadModalY}
              />
            </Animated.View>

            <Animated.View style={[styles.anchorModal, anchorModalReveal]}>
              <AnchorModal
                anchorModalY={anchorModalY}
                SiteName={selectedDiveSite.SiteName}
                Lat={selectedDiveSite.Latitude}
                Lng={selectedDiveSite.Longitude}
              />
            </Animated.View>

            <Animated.View style={[styles.anchorModal, diveSiteModalReveal]}>
              <DiveSiteModal diveSiteModalY={diveSiteModalY} />
            </Animated.View>

            <Animated.View style={[styles.anchorModal, pictureModalReveal]}>
              <PicUploadModal pictureModalY={pictureModalY} />
            </Animated.View>

            <Animated.View style={[styles.tutorialModal, tutorialModalReveal]}>
              <IntroTutorial tutorialModalY={tutorialModalY} />
            </Animated.View>

            <Animated.View style={[styles.tutorialModal, tutorial2ModalReveal]}>
              <SecondTutorial tutorial2ModalY={tutorial2ModalY} />
            </Animated.View>

            <Animated.View style={[styles.tutorialModal, tutorial3ModalReveal]}>
              <ThirdTutorial tutorial3ModalY={tutorial3ModalY} />
            </Animated.View>

            <Animated.View style={[styles.anchorModal, profileModalReveal]}>
              <UserProfileModal/>
            </Animated.View>

            <Map style={{ zIndex: 1 }} />
          </View>
        </DiveSitesContext.Provider>
      </MapCenterContext.Provider>
    </MonthSelectContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    //Constants.statusBarHeight +
    top: scale(0),
    width: "80%",
    height: scale(38),
    zIndex: 2,
    borderRadius: scale(15),
    opacity: 0.8,
    paddingBottom: 0,
    paddingTop: scale(10),
    backgroundColor: "white",
    paddingRight: "2%",
    paddingLeft: "2%",
  },
  monthText: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    //Constants.statusBarHeight +
    top: scale(2),
    width: "10%",
    height: scale(20),
    zIndex: 3,
    borderRadius: scale(15),
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: "transparent",
    opacity: 0.8,
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
  Fbuttons: {
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 5,
    width: 100,
    height: 40,
    zIndex: 2,
    borderRadius: 15,
    opacity: 1,
    paddingTop: -5,
  },
  PinButton: {
    position: "absolute",
    alignItems: "center",
    textAlign: "center",
    bottom: scale(28),
    backgroundColor: "#538dbd",
    borderRadius: scale(10),
    marginBottom: 0,
    width: "50%",
    height: scale(30),
    zIndex: 2,
    paddingTop: 3,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.9,
    shadowRadius: 5,

    elevation: 10,
  },
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
    // flex: 1,
    position: "absolute",
    // justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    // backgroundColor: "blue",
    height: 105,
    top: Platform.OS === "ios" ? "5%" : "4%",
    zIndex: 3,
  },
  filterer: {
    flex: 1,
    alignSelf: "center",
    flexDirection: "column",
    position: "absolute",
    // justifyContent: "center",
    flexDirection: "column",
    // alignContent: "center",
    // alignItems: "center",
    // height: 25,
    width: "50%",
    top: Platform.OS === "ios" ? "100%" : "100%",
    zIndex: 3,
    // backgroundColor: "green"
  },
  emptyBox: {
    // position: "absolute",
    // top: -15,
    alignSelf: "center",
    flexDirection: "column",
    // justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // height: scale(55),
    width: "100%",
    zIndex: 3,
    // backgroundColor: "grey"
  },
  tutorialBar: {
    width: "25%",
    position: "absolute",
    left: "5%",
    // justifyContent: "center",
    // alignItems: "center",
    // alignContent: "space-between",
    top: Platform.OS === "ios" ? "6%" : "6%",
    zIndex: 55,
    // backgroundColor:"pink"
  },
  Hist: {
    alignItems: "center",
    position: "absolute",
    bottom: scale(30),
    left: scale(75),
    width: scale(190),
    height: 100,
    zIndex: 2,
    borderRadius: 15,
    opacity: 0.8,
    backgroundColor: "transparent",
  },
  tutorialModal: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 50,
    left: 0,
  },
  anchorModal: {
    position: "absolute",
    height: windowHeight - windowHeight * 0.14,
    width: windowWidth - windowWidth * 0.1,
    marginLeft: "5%",
    backgroundColor: "#538bdb",
    borderRadius: 15,
    zIndex: 25,
    left: 0,
  },
  pullTab: {
    height: windowWidth > 600 ? scale(10) : scale(15),
    width: windowWidth > 600 ? scale(80) : scale(100),
    backgroundColor: "gold",
    borderBottomRightRadius: scale(7),
    borderBottomLeftRadius: scale(7),
    zIndex: 10
  },
  closer: {
    zIndex: 5
  },
});
