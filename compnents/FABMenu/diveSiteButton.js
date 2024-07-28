import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { IterratorContext } from "../contexts/iterratorContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { MaterialIcons } from "@expo/vector-icons";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { useButtonPressHelper } from "./buttonPressHelper";

export default function DiveSiteButton() {
  const [butState, setButState] = useState(false);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { setLargeModalSecond } = useContext(LargeModalSecondContext);
  const { setSmallModal } = useContext(SmallModalContext);

  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);

  const { itterator } = useContext(IterratorContext);
  const { itterator2 } = useContext(Iterrator2Context);
  const { itterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning } = useContext(TutorialContext);

  let counter = 0;
  let blinker;

  function diveSiteAdd() {
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
      if (itterator2 === 9) {
        blinker = setInterval(diveSiteAdd, 1000);
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
    setActiveButtonID("DiveSiteAdderButton");
    useButtonPressHelper(
      "DiveSiteAdderButton",
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
          itterator === 15 ||
          itterator === 18 ||
          itterator2 === 3 ||
          itterator2 === 5 ||
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
          <MaterialIcons
            name="add-location-alt"
            color={butState ? "gold" : "white"}
            size={moderateScale(34)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>
            Site Add
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "green",
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
    fontSize: moderateScale(12),
    marginTop: moderateScale(0),
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold",
    fontSize: moderateScale(12),
    marginTop: moderateScale(0),
  },
});
