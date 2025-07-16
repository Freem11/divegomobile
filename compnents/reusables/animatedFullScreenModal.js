import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";

import OnboardingTest from "../tutorial/onboarding";
import PhotoBoxModel from '../screens/photoBox/photoBoxModal';
import CommentsModal from "../modals/commentsModal";
import EditScreenParallax from '../screens/edits/editsParallax';
import DiveSitePhotosPage from '../screens/diveSitePhotos';

import { colors } from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

export default function AnimatedFullScreenModal(props) {
  const { activeTutorialID } = useContext(ActiveTutorialIDContext);
  const { fullScreenModal } = useContext(FullScreenModalContext);
  const fullScreenModalY = useSharedValue(0);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: fullScreenModalY.value }],
    };
  });

  const startfullScreenModalAnimation = () => {
    if (fullScreenModalY.value === 0) {
      fullScreenModalY.value = withTiming(windowHeight);
    } else {
      fullScreenModalY.value = withTiming(0);
    }
  };

  useEffect(() => {
    startfullScreenModalAnimation();
  }, [fullScreenModal]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeTutorialID === "OnboardingX" && <OnboardingTest />}
      {activeTutorialID === "PinchAndZoomPhoto" && fullScreenModal && <PhotoBoxModel />}
      {activeTutorialID === "CommentsModal" && <CommentsModal />}
      {activeTutorialID === "EditsScreen" && <EditScreenParallax/>}
      {activeTutorialID === "DiveSitePhotos" && <DiveSitePhotosPage />}
      

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 50,
    left: 0,
    backgroundColor: colors.themeBlack
  },
});
