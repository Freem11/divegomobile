import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
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
import { scale } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function MapPage() {
  const { masterSwitch, setMasterSwitch } = useContext(MasterContext);
  const { dragPin } = useContext(PinSpotContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { animalSelection } = useContext(AnimalSelectContext);
  const [monthVal, setMonthVal] = useState("");
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

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
              <View style={styles.PinButton}>
                <TouchableWithoutFeedback onPress={onNavigate}>
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
    top:  scale(0),
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
    top: scale(10),
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
  carrousel: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    //Constants.statusBarHeight +
    top: Platform.OS === "ios" ? scale(40) : scale(-5),
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
});
