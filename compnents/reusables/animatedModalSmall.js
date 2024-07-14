import React, { useState, useEffect, useContext } from "react";
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
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { LargeModalContext } from "../contexts/largeModalContext";

import MapSearchModal from "../modals/mapSearchModal";
import DiveSiteSearchModal from "../modals/diveSiteSearchModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalSmall(props) {
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID } = useContext(PreviousButtonIDContext);
  const { smallModal } = useContext(SmallModalContext);
  const { setLargeModal } = useContext(LargeModalContext);
  const { setLargeModalSecond } = useContext(LargeModalSecondContext);
  
  const [diveSearchBump, setDiveSearchBump] = useState(false);
  const [mapSearchBump, setMapSearchBump] = useState(false);

  const smallModalY = useSharedValue(-windowHeight);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: smallModalY.value }],
    };
  });

  const startSmallModalAnimation = () => {
    if (smallModalY.value === windowHeight) {
      smallModalY.value = withTiming(-windowHeight*1.1);
    } else {
      smallModalY.value = withTiming(windowHeight);
    }
  };

  useEffect(() => {
    setLargeModal(false);
    setLargeModalSecond(false);
    if(smallModal){
      smallModalY.value = withTiming(-windowHeight * 1.1);
    } else {
      smallModalY.value = withTiming(windowHeight);
    }
  }, [smallModal]);


  useEffect(() => {
    if (diveSearchBump) {
      smallModalY.value = withTiming(-windowHeight*1.35);
    }
    setDiveSearchBump(false);
  }, [diveSearchBump]);

  useEffect(() => {
    if (mapSearchBump) {
      smallModalY.value = withTiming(-windowHeight*1.35);
    }
    setMapSearchBump(false);
  }, [mapSearchBump]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeButtonID === "DiveSiteSearchButton" && (
        <DiveSiteSearchModal setDiveSearchBump={setDiveSearchBump} />
      )}
      {activeButtonID === "MapSearchButton" && (
        <MapSearchModal setMapSearchBump={setMapSearchBump} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    position: "absolute",
    bottom: -windowHeight + windowHeight * 0.3,
    height: windowHeight - windowHeight * 0.75,
    width: windowWidth - windowWidth * 0.2,
    marginLeft: windowWidth * 0.05,
    backgroundColor: "#538bdb",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    zIndex: 25,
  },
});
