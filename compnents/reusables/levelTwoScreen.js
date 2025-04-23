import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import UserProfile from '../screens/userProfile';
import PartnerRequestPage from '../screens/partnerRequestPage';
import PicUploader from '../screens/picUploader';
import DiveSiteUploadScreen from '../screens/diveSiteUploader';
import TripCreatorPage from '../screens/tripCreator';
import NewTripCreatorPage from '../screens/newTripCreator';
import { colors } from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

export default function LevelTwoScreen() {
  const { activeScreen } = useContext(ActiveScreenContext);
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
      {activeScreen === "ProfileScreen" && <UserProfile />}
      {activeScreen === "PartnerRequestScreen" && <PartnerRequestPage />}
      {activeScreen === "PictureUploadScreen" && <PicUploader />}
      {activeScreen === "DiveSiteUploadScreen" && <DiveSiteUploadScreen />}
      {activeScreen === "TripCreatorScreen" && <NewTripCreatorPage />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    backgroundColor: colors.themeBlack,
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 50,
    left: 0,
  },
});
