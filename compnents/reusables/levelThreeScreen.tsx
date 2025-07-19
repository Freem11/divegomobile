import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../styles";
import DiveSitePhotosPage from "../screens/diveSitePhotos";
import DiveSiteTripsPage from "../screens/diveSiteTrips";
import UserProfilePhotosPage from "../screens/userProfilePhotos";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { LevelThreeScreenContext } from "../contexts/levelThreeScreenContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

export default function LevelThreeScreen() {
  const { activeTutorialID } = useContext(ActiveTutorialIDContext);
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

  console.log('activeTutorialID', activeTutorialID)

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeTutorialID === "DiveSitePhotos" && <DiveSitePhotosPage />}
      {activeTutorialID === "DiveSiteTrips" && <DiveSiteTripsPage />}
      {activeTutorialID === "UserProfilePhotos" && <UserProfilePhotosPage />}
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
