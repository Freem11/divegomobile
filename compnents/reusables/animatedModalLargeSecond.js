import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";

import PartnerAccountRequestModal from "../modals/partnerAccountRequestModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalLargeSecond(props) {
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModalSecond } = useContext(LargeModalSecondContext);

  const largeSeconModalY = useSharedValue(-windowHeight);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: largeSeconModalY.value }],
    };
  });

  const startLargeModalAnimation = () => {
    if (largeSeconModalY.value === windowHeight) {
      largeSeconModalY.value = withTiming(-windowHeight * 1.1);
    } else {
      largeSeconModalY.value = withTiming(windowHeight);
    }
  };

  useEffect(() => {
    let timout;
    windowHeight > 1000 ? (timout = 900) : (timout = 400);
    if (
      largeSeconModalY.value === -windowHeight * 1.1 &&
      activeButtonID !== previousButtonID
    ) {
      // console.log('conditiion met')
      startLargeModalAnimation();
      setTimeout(() => {
        startLargeModalAnimation();
      }, 315);
      return;
    } else {
      // console.log('conditiion 3 met')
      setTimeout(() => {
        startLargeModalAnimation();
      }, 100);
      return;
    }
  }, [largeModalSecond]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeButtonID === "PartnerAccountButton" && <PartnerAccountRequestModal />}
      
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    position: "absolute",
    bottom: -windowHeight - windowHeight * 0.05,
    height: windowHeight - windowHeight * 0.1,
    width: windowWidth - windowWidth * 0.1,
    marginLeft: windowWidth * 0.05,
    backgroundColor: "green",
    backgroundColor: "#538bdb",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    zIndex: 25,
  },
});
