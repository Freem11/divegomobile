import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
// import Device from "expo-device";
import Map from "./GoogleMap";
import FABButtons from "./FABset";
import Logo from "./logo/logoButton";
import AnimalTopAutoSuggest from "./animalTags/animalTagContainer";
import PhotoMenu from "./photoMenu/photoMenu";
import Historgram from "./histogram/histogramBody";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { PictureAdderContext } from "./contexts/picModalContext";
import { MasterContext } from "./contexts/masterContext";
import { PinSpotContext } from "./contexts/pinSpotContext";
import { PinContext } from "./contexts/staticPinContext";
import { AnimalSelectContext } from "./contexts/animalSelectContext";
import { MonthSelectContext } from "./contexts/monthSelectContext";
import { TutorialModelContext } from "./contexts/tutorialModalContext";
import { TutorialLaunchPadContext } from "./contexts/tutorialLaunchPadContext";
import { SelectedDiveSiteContext } from "./contexts/selectedDiveSiteContext";
import { AnchorModalContext } from "./contexts/anchorModalContext";;
import { DSAdderContext } from "./contexts/DSModalContext";
import { IterratorContext } from "./contexts/iterratorContext";

import { scale } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import TutorialsModal from "./modals/tutorialsModal";
import AnchorModal from "./modals/anchorModal";
import DiveSiteModal from "./modals/diveSiteAdderModal";
import PicUploadModal from "./modals/picUploaderModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function MapPage() {
  const { masterSwitch, setMasterSwitch } = useContext(MasterContext);
  const { dragPin } = useContext(PinSpotContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { animalSelection } = useContext(AnimalSelectContext);
  const [monthVal, setMonthVal] = useState("");
  
  //Tutorial Model Animation
  const tutorialLaunchpadModalY = useSharedValue(windowHeight);
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(TutorialLaunchPadContext);
  const { itterator, setItterator } = useContext(IterratorContext);

  const tutorialLaunchpadModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorialLaunchpadModalY.value }],
    };
  });

  const startTutorialLaunchPadModalAnimations = () => {
    if (tutorialLaunchpadModal) {
      tutorialLaunchpadModalY.value = withTiming(0);
    } else {
      tutorialLaunchpadModalY.value = withTiming(windowHeight);
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
      anchorModalY.value = withTiming(0);
    } else {
      anchorModalY.value = withTiming(windowHeight);
    }
  };

  useEffect(() => {
    startAnchorModalAnimations();
    if (itterator > 0){
      setItterator(itterator + 1); 
    }
    
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
      diveSiteModalY.value = withTiming(0);
    } else {
      diveSiteModalY.value = withTiming(windowHeight);
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
      pictureModalY.value = withTiming(0);
    } else {
      pictureModalY.value = withTiming(windowHeight);
    }
  };

  useEffect(() => {
    startPictureModalAnimations();
    // if (itterator > 0){
    //   setItterator(itterator + 1); 
    // }
    
  }, [picAdderModal]);





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

  const onNavigate = () => {
    setPinValues({
      ...pinValues,
      Latitude: dragPin.lat.toString(),
      Longitude: dragPin.lng.toString(),
    });
    setMasterSwitch(true);
    setPicAdderModal(!picAdderModal);
  };

  useEffect(() => {
    if (animalSelection.length > 0) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, [animalSelection]);

  const [subButState, setSubButState] = useState(false);

  return (
    <MonthSelectContext.Provider value={{ monthVal, setMonthVal }}>
      <MapCenterContext.Provider value={{ mapCenter, setMapCenter }}>
        <DiveSitesContext.Provider value={{ diveSitesTog, setDiveSitesTog }}>
          <KeyboardAvoidingView style={styles.container} behavior="height">
            {masterSwitch && (
              <View style={styles.carrousel}>
                <PhotoMenu style={{ zIndex: 3 }} />
              </View>
            )}

            {masterSwitch && (
              <View style={styles.animalSelect}>
                <AnimalTopAutoSuggest transTagsY={transTagsY} />
              </View>
            )}

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
                <TouchableWithoutFeedback
                  onPress={onNavigate}
                  onPressIn={() => setSubButState(true)}
                  onPressOut={() => setSubButState(false)}
                >
                  <Text
                    style={{
                      color: "gold",
                      fontFamily: "PermanentMarker_400Regular",
                      fontSize: scale(15),
                      width: "90%",
                      height: "100%",
                      textAlign: "center",
                      backgroundColor: "transparent",
                      borderRadius: scale(15),
                    }}
                  >
                    Set Pin
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            )}

            {masterSwitch && (
              <View style={styles.Hist} pointerEvents={"none"}>
                <Historgram style={{ zIndex: 2 }} />
              </View>
            )}

            <Logo style={styles.Logo} pointerEvents={"none"} />

            {/* modals go here? */}
            <Animated.View style={[styles.anchorModal, tutorialLaunchpadModalReveal]}>
              <TutorialsModal tutorialLaunchpadModalY={tutorialLaunchpadModalY} />
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


            <Map style={{ zIndex: 1 }} />
          </KeyboardAvoidingView>
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
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    //Constants.statusBarHeight + 100 +
    top: Platform.OS === "ios" ? 160 : 100,
    zIndex: 1,
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
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    //Constants.statusBarHeight +
    top: Platform.OS === "ios" ? "3%" : "0%",
    zIndex: 2,
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
    height: windowHeight - (windowHeight*0.14),
    width: windowWidth - (windowWidth*0.1),
    marginLeft: "5%",
    backgroundColor: "#538bdb",
    borderRadius: 15,
    zIndex: 25,
    left: 0,
  },
});
