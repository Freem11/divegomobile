import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveScreenContext } from '../contexts/activeScreenContext';
import { LevelThreeScreenContext } from '../contexts/levelThreeScreenContext';

import Settings from '../screens/settings';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

export default function LevelThreeScreen() {
  const { activeScreen } = useContext(ActiveScreenContext);
  const { levelThreeScreen } = useContext(LevelThreeScreenContext);

  const levelThreeScreenY = useSharedValue(0);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: levelThreeScreenY.value }],
    };
  });

  const startlevelThreeScreenAnimation = () => {
    if (levelThreeScreenY.value === 0) {
      levelThreeScreenY.value = withTiming(windowHeight);
    } else {
      levelThreeScreenY.value = withTiming(0);
    }
  };

  useEffect(() => {
    startlevelThreeScreenAnimation();
  }, [levelThreeScreen]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeScreen === "SettingsScreen" && <Settings/>}
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
