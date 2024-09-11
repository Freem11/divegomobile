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
import { ActiveScreenContext } from '../contexts/activeScreenContext';
import { LevelOneScreenContext } from '../contexts/levelOneScreenContext';

import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { useButtonPressHelper } from "./buttonPressHelper";
import { MaterialIcons } from "@expo/vector-icons";

export default function SiteSearchButton() {
  const [butState, setButState] = useState(false);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { activeScreen, setActiveScreen } = useContext(
    ActiveScreenContext
    );
  const { levelOneScreen, setLevelOneScreen } = useContext(LevelOneScreenContext);

  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);

  const handlePress = () => {
    setTiles(true);
    setShowFilterer(false);

    setPreviousButtonID(activeButtonID);
    setActiveScreen("SearchScreen");
    useButtonPressHelper(
      "SearchScreen",
      activeScreen,
      levelOneScreen,
      setLevelOneScreen
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => handlePress()}
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
            name="explore"
            color={butState ? "gold" : "white"}
            size={moderateScale(34)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>
             Search Map
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
