import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { IterratorContext } from "../contexts/iterratorContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { useButtonPressHelper } from "./buttonPressHelper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SiteSearchButton() {
  const [butState, setButState] = useState(false);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { smallModal, setSmallModal } = useContext(SmallModalContext);
  const { setLargeModalSecond } = useContext(LargeModalSecondContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);

  const { itterator } = useContext(IterratorContext);
  const { itterator2 } = useContext(Iterrator2Context);
  const { itterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning } = useContext(TutorialContext);

  let counter = 0;
  let blinker;

  function diveSiteSearch() {
    counter++;
    if (counter % 2 == 0) {
      setButState(false);
    } else {
      setButState(true);
    }
  }

  function cleanUp() {
    clearInterval(blinker);
    setButState(false);
  }

  useEffect(() => {
    if (tutorialRunning) {
      if (itterator2 === 3) {
        blinker = setInterval(diveSiteSearch, 1000);
      }
    }
    return () => cleanUp();
  }, [itterator2]);

  const handlePress = () => {
    setTiles(true);
    setShowFilterer(false);
    setLargeModalSecond(false);
    setSmallModal(false);
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("DiveSiteSearchButton");
    useButtonPressHelper(
      "DiveSiteSearchButton",
      activeButtonID,
      largeModal,
      setLargeModal
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={
          itterator === 11 ||
          itterator === 18 ||
          itterator2 === 5 ||
          itterator2 === 9 ||
          itterator3 === 5
            ? null
            : handlePress
        }
        onPressIn={() => setButState(true)}
        onPressOut={() => setButState(false)}
        style={{
          alignItems: "center",
          width: moderateScale(32),
          height: moderateScale(32),
        }}
      >
        <View style={styles.buttonBox}>
          <MaterialCommunityIcons
            name="map-search-outline"
            color={butState ? "gold" : "white"}
            size={moderateScale(34)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>
            Site Search
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    bottom: 0,
    left: 0,
    fontSize: "2rem",
  },
  buttonBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#538bdb",
    width: moderateScale(80),
    height: moderateScale(55),
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(13),
    marginTop: moderateScale(0),
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold",
    fontSize: moderateScale(13),
    marginTop: moderateScale(0),
  },
});
