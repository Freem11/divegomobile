import React, { useState, useContext } from "react";
import GuideModal from "./modals/howToGuideModal";
import DiveSiteModal from "./modals/diveSiteAdderModal";
import PicUploadModal from "./modals/picUploaderModal";
import SettingsModal from "./modals/settingsModal";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { PictureAdderContext } from "./contexts/picModalContext";
import { DSAdderContext } from "./contexts/DSModalContext";
import { PinContext } from "./contexts/staticPinContext";
import { PictureContext } from "./contexts/pictureContext";
import { SessionContext } from "./contexts/sessionContext";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Modal,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialIcons, FontAwesome5, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function FABButtons() {
  const { diveSitesTog, setDiveSitesTog } = useContext(DiveSitesContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { uploadedFile, setUploadedFile } = useContext(PictureContext);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);
  const { diveSiteAdderModal, setDiveSiteAdderModal } =
    useContext(DSAdderContext);
  const [guideModal, setGuideModal] = useState(false);
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

  return (
    <View style={styles.fab}>
      <Animated.View
        style={[styles.buttonwrapper, styles.optionWrapper, transGearY]}
      >
        <TouchableWithoutFeedback onPress={() => setGearModal(!gearModal)}>
          <MaterialIcons name="settings" color="aquamarine" size={32} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View
        style={[styles.buttonwrapper, styles.optionWrapper, transInfoY]}
      >
        <TouchableWithoutFeedback onPress={() => setGuideModal(!guideModal)}>
          <FontAwesome5 name="question" color="aquamarine" size={32} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <TouchableWithoutFeedback onPress={startGeoCodeButtonAnimations}>
        <Animated.View
          style={[styles.buttonwrapper, styles.optionWrapper, transGeoY]}
        >
          <MaterialIcons name="explore" color="aquamarine" size={32} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => setPicAdderModal(!picAdderModal)}
      >
        <Animated.View
          style={[styles.buttonwrapper, styles.optionWrapper, transPhotoY]}
        >
          <MaterialIcons name="photo-camera" color="aquamarine" size={32} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => setDiveSiteAdderModal(!diveSiteAdderModal)}
      >
        <Animated.View
          style={[styles.buttonwrapper, styles.optionWrapper, transSiteY]}
        >
          <MaterialIcons name="add-location-alt" color="aquamarine" size={32} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={startAnimalButtonAnimations}>
        <Animated.View
          style={[styles.buttonwrapper, styles.optionWrapper, transSearchY]}
        >
          <MaterialCommunityIcons name="map-search-outline" color="aquamarine" size={32} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => setDiveSitesTog(!diveSitesTog)}>
        <Animated.View
          style={[styles.buttonwrapper, styles.optionWrapper, transAnchorY]}
        >
          <MaterialIcons name="anchor" color="aquamarine" size={32} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={startButtonAnimations}>
        <Animated.View
          style={[
            styles.topbuttonwrapper,
            styles.menuWrapper,
            animatedRotation,
          ]}
        >
          <FontAwesome5 name="plus" color="black" size={32} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.OS === "android" ? 200 : 0}
      >
        <Animated.View style={[styles.animal, animalReveal]}>
          <DiveSiteAutoComplete/>
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
      
      <Modal visible={picAdderModal} animationType="slide" transparent={true}>
        <View style={styles.modalStyle}>
          <View style={styles.title}>
            <View>
              <Text style={styles.header}>Submit Your Picture</Text>
            </View>
            <TouchableWithoutFeedback onPress={togglePicModal}>
              <View style={styles.closeButton}>
                <FontAwesome name="close" color="#BD9F9F" size={28} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <PicUploadModal />
        </View>
      </Modal>

      <Modal
        visible={diveSiteAdderModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalStyle}>
          <View style={styles.title}>
            <View>
              <Text style={styles.header}>Submit Your Dive Site</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => setDiveSiteAdderModal(!diveSiteAdderModal)}
            >
              <View style={styles.closeButton}>
                <FontAwesome name="close" color="#BD9F9F" size={28} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <DiveSiteModal/>
        </View>
      </Modal>

      <Modal visible={guideModal} animationType="slide" transparent={true}>
        <View style={styles.modalStyle}>
          <View style={styles.titleAlt}>
            <View>
              <Text style={styles.headerAlt}>How to Use DiveGo</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => setGuideModal(!guideModal)}
            >
              <View style={styles.closeButtonAlt}>
                <FontAwesome name="close" color="#BD9F9F" size={28} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <GuideModal />
        </View>
      </Modal>

      <Modal visible={gearModal} animationType="slide" transparent={true}>
        <View style={styles.modalStyle}>
          <View style={styles.titleAlt}>
            <View>
              <Text style={styles.headerAlt}>Settings</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => setGearModal(!gearModal)}
            >
              <View style={styles.closeButtonAlt}>
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
  menuWrapper: {
    backgroundColor: "aquamarine",
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
    marginLeft: '7%',
    marginRight: '7%',
    marginTop: '15%',
    marginBottom: '15%',
    shadowOpacity: 0.2,
    shadowRadius: 50,
  },
  closeButton: {
    position: "absolute",
    borderRadius: scale(42 / 2),
    height: 42,
    width: 42,
    top: 0,
    right: "5%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -3
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
  header: {
    fontFamily: "PermanentMarker_400Regular",
    fontSize: scale(17),
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 0,
    marginLeft: "-15%",
    height: scale(50),
    color: "#F0EEEB",
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
    flexDirection: "column",
    marginTop: scale(25),
    width: "100%",
    height: 80,
    color: "#F0EEEB",
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
