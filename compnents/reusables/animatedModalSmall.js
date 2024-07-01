import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { SmallModalContext } from "../contexts/smallModalContext";

import MapSearchModal from '../modals/mapSearchModal';
import DiveSiteSearchModal from '../modals/diveSiteSearchModal'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalSmall(props) {
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID } = useContext(PreviousButtonIDContext);
  const { smallModal } = useContext(SmallModalContext);

  const smallModalY = useSharedValue(scale(1200));

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: smallModalY.value }],
    };
  });

  const startSmallModalAnimation = () => {
    if (smallModalY.value === windowHeight) {
      smallModalY.value = withTiming(scale(-550));
    } else {
      smallModalY.value = withTiming(windowHeight);
    }
  };

  useEffect(() => {
    if (
      smallModalY.value === scale(-550) &&
      activeButtonID !== previousButtonID
    ) {
      startSmallModalAnimation();
      setTimeout(() => {
        startSmallModalAnimation();
      }, 300);
    } else {
      startSmallModalAnimation();
    }
  }, [smallModal]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeButtonID === "DiveSiteSearchButton" && <DiveSiteSearchModal />}
      {activeButtonID === "MapSearchButton" && <MapSearchModal />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    position: "absolute",
    bottom: -windowHeight + windowHeight * 0.3,
    height: windowHeight - windowHeight * 0.6,
    width: windowWidth - windowWidth * 0.2,
    marginLeft: windowWidth * 0.05,
    backgroundColor: "#538bdb",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    zIndex: 25,
  },
});
