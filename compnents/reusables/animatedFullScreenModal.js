import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";

import IntroTutorial from "../tutorial/introTutorial";
import SecondTutorial from "../tutorial/secondTutorial";
import ThirdTutorial from "../tutorial/thirdTutorial";
import PhotoBoxModel from "../modals/photoBoxModal";
import CommentsModal from "../modals/commentsModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
      {activeTutorialID === "FirstGuide" && <IntroTutorial />}
      {activeTutorialID === "SecondGuide" && <SecondTutorial />}
      {activeTutorialID === "ThirdGuide" && <ThirdTutorial />}
      {activeTutorialID === "PinchAndZoomPhoto" && <PhotoBoxModel />}
      {activeTutorialID === "CommentsModal" && <CommentsModal />}
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
    // backgroundColor: "pink"
  },
});
