import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { TutorialContext } from "../contexts/tutorialContext";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActiveScreenContext } from '../contexts/activeScreenContext';
import { LevelTwoScreenContext } from '../contexts/levelTwoScreenContext';

import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { useButtonPressHelper } from "./buttonPressHelper";

export default function ProfileButton() {
  const [butState, setButState] = useState(false);
  const { activeScreen, setActiveScreen } = useContext(
    ActiveScreenContext
    );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(LevelTwoScreenContext);


  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(
    LargeModalSecondContext
  );
  const { setSmallModal } = useContext(SmallModalContext);

  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);
  const { tutorialRunning } = useContext(TutorialContext);

  const handlePress = () => {
    setTiles(true);
    setShowFilterer(false);

    setPreviousButtonID(activeScreen);
    setActiveScreen("ProfileScreen");
    useButtonPressHelper(
      "ProfileScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={tutorialRunning ? null : handlePress}
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
            name="account"
            color={butState ? "gold" : "white"}
            size={moderateScale(37)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>
            Profile
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
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
    height: moderateScale(53),
    marginTop: moderateScale(-2),
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
