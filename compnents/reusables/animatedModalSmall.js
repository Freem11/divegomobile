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

import MapSearchModal from "../modals/mapSearchModal";
import DiveSiteSearchModal from "../modals/diveSiteSearchModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalSmall(props) {
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID } = useContext(PreviousButtonIDContext);
  const { smallModal } = useContext(SmallModalContext);

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
    let timout
    windowHeight > 1000 ? timout = 850 : timout = 400
    if (
      (smallModalY.value === -windowHeight*1.1)  &&
      (activeButtonID !== previousButtonID)
    ) {
      // console.log('conditiion met')
      startSmallModalAnimation();
      setTimeout(() => {
        startSmallModalAnimation();
      }, 315);
      return
    } else if ( 
      (smallModalY.value === -windowHeight*1.35)  &&
    (activeButtonID !== previousButtonID)
    ){
      // console.log('conditiion 2 met')
      startSmallModalAnimation();
      setTimeout(() => {
        startSmallModalAnimation();
      }, timout);
      return
    } else {
      // console.log('conditiion 3 met')
      setTimeout(() => {
        startSmallModalAnimation();
      }, 100);
      return
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
