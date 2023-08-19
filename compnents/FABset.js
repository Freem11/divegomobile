import React, { useState, useContext, useEffect } from "react";
// import GuideModal from "./modals/howToGuideModal";
import IntroTutorial from "./tutorial/introTutorial";
import DiveSiteModal from "./modals/diveSiteAdderModal";
import PicUploadModal from "./modals/picUploaderModal";
import SettingsModal from "./modals/settingsModal";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { PictureAdderContext } from "./contexts/picModalContext";
import { DSAdderContext } from "./contexts/DSModalContext";
import { PinContext } from "./contexts/staticPinContext";
import { PictureContext } from "./contexts/pictureContext";
import { TutorialLaunchPadContext } from "./contexts/tutorialLaunchPadContext";
import { SessionContext } from "./contexts/sessionContext";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Modal,
  Text,
  Platform,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import DiveSiteAutoComplete from "./diveSiteSearch/diveSiteAutocomplete";
import GeocodeAutocomplete from "./locationSearch/geocodeAutocomplete";
import { removePhoto } from "../supabaseCalls/uploadSupabaseCalls";
import { scale } from "react-native-size-matters";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


export default function FABButtons() {
  const { diveSitesTog, setDiveSitesTog } = useContext(DiveSitesContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { uploadedFile, setUploadedFile } = useContext(PictureContext);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);
  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );
  const [gearModal, setGearModal] = useState(false);

  const rotationVal = useSharedValue(0);
  const transYanchor = useSharedValue(0);
  const transYsearch = useSharedValue(0);
  const transYsite = useSharedValue(0);
  const transYphoto = useSharedValue(0);
  const transYgeo = useSharedValue(0);
  const transYinfo = useSharedValue(0);
  const transYgear = useSharedValue(0);

  const animalWidth = useSharedValue(1000);
  const geocodeWidth = useSharedValue(1000);

  
  const rotation = useDerivedValue(() => {
    return interpolate(rotationVal.value, [0, 45], [0, 45]);
  });

  const animatedRotation = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: rotation.value + "deg" }],
    };
  });

  const startButtonAnimations = () => {
    if (rotationVal.value === 45) {
      rotationVal.value = withSpring(0);
      transYanchor.value = withTiming(0);
      transYsearch.value = withTiming(0);
      transYsite.value = withTiming(0);
      transYphoto.value = withTiming(0);
      transYgeo.value = withTiming(0);
      transYinfo.value = withTiming(0);
      transYgear.value = withTiming(0);
      animalWidth.value = withTiming(1000);
      geocodeWidth.value = withTiming(1000);
    } else {
      rotationVal.value = withSpring(45);
      transYanchor.value = withSpring(-65);
      transYsearch.value = withSpring(-215);
      transYsite.value = withSpring(-115);
      transYphoto.value = withSpring(-165);
      transYgeo.value = withSpring(-265);
      transYinfo.value = withSpring(-315);
      transYgear.value = withSpring(-365);
    }
  };

  const animalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animalWidth.value }],
    };
  });

  const startAnimalButtonAnimations = () => {
    if (animalWidth.value === 1000) {
      animalWidth.value = withTiming(-200);
    } else {
      animalWidth.value = withTiming(1000);
    }
  };

  const geocodeReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: geocodeWidth.value }],
    };
  });

  const startGeoCodeButtonAnimations = () => {
    if (geocodeWidth.value === 1000) {
      geocodeWidth.value = withTiming(-200);
    } else {
      geocodeWidth.value = withTiming(1000);
    }
  };

  const transAnchorY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYanchor.value }],
    };
  });

  const transSearchY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYsearch.value }],
    };
  });

  const transSiteY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYsite.value }],
    };
  });

  const transPhotoY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYphoto.value }],
    };
  });

  const transGeoY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYgeo.value }],
    };
  });

  const transInfoY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYinfo.value }],
    };
  });

  const transGearY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYgear.value }],
    };
  });

  const togglePicModal = () => {
    setPicAdderModal(!picAdderModal);

    if (pinValues.PicFile !== null) {
      removePhoto({
        filePath: "./wetmap/src/components/uploads/",
        fileName: uploadedFile,
      });
    }

    setUploadedFile(null);

    if (picAdderModal) {
      setPinValues({
        PicFile: null,
        Animal: "",
        PicDate: "",
        Latitude: "",
        Longitude: "",
        DDVal: "0",
      });
    }
  };

  let buttonOpac;
  if (Platform.OS === "ios") {
    buttonOpac = 0.8;
  } else {
    buttonOpac = 0.9;
  }

  const [menuButState, setMenuButState] = useState(false);
  const [anchButState, setAnchButState] = useState(false);
  const [siteButState, setSiteButState] = useState(false);
  const [photButState, setPhotButState] = useState(false);
  const [searButState, setSearButState] = useState(false);
  const [naviButState, setNaviButState] = useState(false);
  const [how2ButState, setHow2ButState] = useState(false);
  const [settButState, setSettButState] = useState(false);

  const [picCloseState, setPicCloseState] = useState(false);
  const [diveCloseState, setDiveCloseState] = useState(false);
  const [gearCloseState, setGearCloseState] = useState(false);
  const [settCloseState, setSettCloseState] = useState(false);

  return (
    <View style={styles.fab}>
      <Animated.View
        style={[
          settButState ? styles.buttonwrapperPressed : styles.buttonwrapper,
          styles.optionWrapper,
          transGearY,
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => setGearModal(!gearModal)}
          onPressIn={() => setSettButState(true)}
          onPressOut={() => setSettButState(false)}
        >
          <MaterialIcons
            name="settings"
            color={settButState ? "black" : "aquamarine"}
            size={32}
          />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View
        style={[
          how2ButState ? styles.buttonwrapperPressed : styles.buttonwrapper,
          styles.optionWrapper,
          transInfoY,
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => setTutorialLaunchpadModal(!tutorialLaunchpadModal)}
          onPressIn={() => setHow2ButState(true)}
          onPressOut={() => setHow2ButState(false)}
        >
          <FontAwesome5
            name="question"
            color={how2ButState ? "black" : "aquamarine"}
            size={32}
          />
        </TouchableWithoutFeedback>
      </Animated.View>

      <TouchableWithoutFeedback
        onPress={startGeoCodeButtonAnimations}
        onPressIn={() => setNaviButState(true)}
        onPressOut={() => setNaviButState(false)}
      >
        <Animated.View
          style={[
            naviButState ? styles.buttonwrapperPressed : styles.buttonwrapper,
            styles.optionWrapper,
            transGeoY,
          ]}
        >
          <MaterialIcons
            name="explore"
            color={naviButState ? "black" : "aquamarine"}
            size={32}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => setPicAdderModal(!picAdderModal)}
        onPressIn={() => setPhotButState(true)}
        onPressOut={() => setPhotButState(false)}
      >
        <Animated.View
          style={[
            photButState ? styles.buttonwrapperPressed : styles.buttonwrapper,
            styles.optionWrapper,
            transPhotoY,
          ]}
        >
          <MaterialIcons
            name="photo-camera"
            color={photButState ? "black" : "aquamarine"}
            size={32}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => setDiveSiteAdderModal(!diveSiteAdderModal)}
        onPressIn={() => setSiteButState(true)}
        onPressOut={() => setSiteButState(false)}
      >
        <Animated.View
          style={[
            siteButState ? styles.buttonwrapperPressed : styles.buttonwrapper,
            styles.optionWrapper,
            transSiteY,
          ]}
        >
          <MaterialIcons
            name="add-location-alt"
            color={siteButState ? "black" : "aquamarine"}
            size={32}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={startAnimalButtonAnimations}
        onPressIn={() => setSearButState(true)}
        onPressOut={() => setSearButState(false)}
      >
        <Animated.View
          style={[
            searButState ? styles.buttonwrapperPressed : styles.buttonwrapper,
            styles.optionWrapper,
            transSearchY,
          ]}
        >
          <MaterialCommunityIcons
            name="map-search-outline"
            color={searButState ? "black" : "aquamarine"}
            size={32}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => setDiveSitesTog(!diveSitesTog)}
        onPressIn={() => setAnchButState(true)}
        onPressOut={() => setAnchButState(false)}
      >
        <Animated.View
          style={[
            anchButState ? styles.buttonwrapperPressed : styles.buttonwrapper,
            styles.optionWrapper,
            transAnchorY,
          ]}
        >
          <MaterialIcons
            name="anchor"
            color={anchButState ? "black" : "aquamarine"}
            size={32}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={startButtonAnimations}
        onPressIn={() => setMenuButState(true)}
        onPressOut={() => setMenuButState(false)}
      >
        <Animated.View
          style={[
            styles.topbuttonwrapper,
            animatedRotation,
            menuButState ? styles.menuWrapperPressed : styles.menuWrapper,
          ]}
        >
          <FontAwesome5
            name="plus"
            color={menuButState ? "aquamarine" : "black"}
            size={32}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.OS === "android" ? 200 : 0}
      >
        <Animated.View style={[styles.animal, animalReveal]}>
          <DiveSiteAutoComplete />
        </Animated.View>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.OS === "android" ? 200 : 0}
      >
        <Animated.View style={[styles.geoCoder, geocodeReveal]}>
          <GeocodeAutocomplete />
        </Animated.View>
      </KeyboardAvoidingView>

      <Modal visible={gearModal} animationType="slide" transparent={true}>
        <View style={styles.modalStyle}>
          <View style={styles.titleAlt}>
            <View>
              <Text style={styles.headerAlt}>Settings</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => setGearModal(!gearModal)}
              onPressIn={() => setSettCloseState(true)}
              onPressOut={() => setSettCloseState(false)}
            >
              <View
                style={
                  settCloseState
                    ? styles.closeButtonAltPressed
                    : styles.closeButtonAlt
                }
              >
                <FontAwesome name="close" color="#BD9F9F" size={28} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <SettingsModal />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    flex: 1,
    alignItems: "center",
    position: "absolute",
    zIndex: 2,
    bottom: 30,
    height: 10,
    width: 60,
    right: 20,
    backgroundColor: "transparent",
  },
  topbuttonwrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    height: 55,
    width: 55,
  },
  buttonwrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    height: 45,
    width: 45,
    opacity: 1,
    backgroundColor: "black",
  },
  buttonwrapperPressed: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    height: 45,
    width: 45,
    opacity: 1,
    backgroundColor: "aquamarine",
  },
  menuWrapper: {
    backgroundColor: "aquamarine",
    bottom: 0,
    opacity: 1,
  },
  menuWrapperPressed: {
    backgroundColor: "black",
    bottom: 0,
    opacity: 1,
  },
  optionWrapper: {
    bottom: 5,
  },
  animal: {
    bottom: 253,
    width: 0,
    right: 30,
    borderRadius: 10,
    zIndex: 2,
  },
  geoCoder: {
    bottom: 313,
    width: 0,
    right: 40,
    borderRadius: 10,
    zIndex: 2,
  },
  modalStyle: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#538bdb",
    borderRadius: 15,
    margin: scale(29),
    marginLeft: "7%",
    marginRight: "7%",
    marginTop: "15%",
    marginBottom: "15%",
    shadowOpacity: 0.2,
    shadowRadius: 50,
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3
  },
  closeButtonAlt: {
    position: "absolute",
    borderRadius: scale(42 / 2),
    height: 42,
    width: 42,
    top: scale(-5),
    right: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonAltPressed: {
    position: "absolute",
    borderRadius: scale(42 / 2),
    height: 42,
    width: 42,
    top: scale(-5),
    right: "5%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3
  },
  header: {
    fontFamily: "PermanentMarker_400Regular",
    fontSize: scale(17),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
  },
  headerAlt: {
    alignItems: "center",
    alignContent: "center",
    fontFamily: "PermanentMarker_400Regular",
    fontSize: scale(17),
    marginTop: scale(-15),
    marginLeft: "-20%",
    color: "#F0EEEB",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "3%",
    marginLeft: "5%",
    width: "95%",
    height: scale(30),
  },
  titleAlt: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: scale(20),
    width: "100%",
    height: 50,
    color: "#F0EEEB",
  },

});
