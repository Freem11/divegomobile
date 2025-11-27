import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useActiveScreenStore } from "../../store/useActiveScreenStore";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import UserProfileParallax from "../screens/userProfile/userProfileParallax";
import { colors } from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

export default function LevelTwoScreen() {
  const activeScreen = useActiveScreenStore((state) => state.activeScreen);

  const { levelTwoScreen } = useContext(LevelTwoScreenContext);

  const levelTwoScreenY = useSharedValue(0);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: levelTwoScreenY.value }],
    };
  });

  const startlevelTwoScreenAnimation = () => {
    if (levelTwoScreenY.value === 0) {
      levelTwoScreenY.value = withTiming(windowHeight);
    } else {
      levelTwoScreenY.value = withTiming(0);
    }
  };

  useEffect(() => {
    startlevelTwoScreenAnimation();
  }, [levelTwoScreen]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeScreen && activeScreen.screenName === "ProfileScreen" && <UserProfileParallax profileID={activeScreen.params.id} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    backgroundColor: colors.themeWhite,
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 50,
    left: 0,
  },
});
