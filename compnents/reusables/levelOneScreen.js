import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveScreenContext } from '../contexts/activeScreenContext';
import { LevelOneScreenContext } from '../contexts/levelOneScreenContext';

import DiveSite from '../screens/diveSite';
import Settings from '../screens/settings';
import SearchPage from '../screens/search';
import { activeFonts } from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

export default function LevelOneScreen() {
  const { activeScreen } = useContext(ActiveScreenContext);
  const { levelOneScreen } = useContext(LevelOneScreenContext);

  const levelOneScreenY = useSharedValue(0);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: levelOneScreenY.value }],
    };
  });

  const startLevelOneScreenAnimation = () => {
    if (levelOneScreenY.value === 0) {
      levelOneScreenY.value = withTiming(windowHeight);
    } else {
      levelOneScreenY.value = withTiming(0);
    }
  };

  useEffect(() => {
    startLevelOneScreenAnimation();
  }, [levelOneScreen]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeScreen === "DiveSiteScreen" && <DiveSite/>}
      {activeScreen === "SettingsScreen" && <Settings/>}
      {activeScreen === "SearchScreen" && <SearchPage/>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    backgroundColor: "green",
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 50,
    left: 0,
  },
});