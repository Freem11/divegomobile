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
import { LargeModalContext } from "../contexts/largeModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { SmallModalContext } from "../contexts/smallModalContext";

import { DiveSpotContext } from "../contexts/diveSpotContext";
import { MasterContext } from "../contexts/masterContext";

import DiveSiteModal from "../modals/diveSiteAdderModal";
import SettingsModal from "../modals/settingsModal";
import TutorialLaunchPadModal from "../modals/tutorialsModal";
import ItineraryListModal from "../modals/itineraryListModal";

import AnchorModal from "../modals/anchorModal";
import ShopModal from "../modals/shopModal";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalLarge(props) {
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModal } = useContext(LargeModalContext);
  const { setSmallModal } = useContext(SmallModalContext);
  const { setLargeModalSecond } = useContext(LargeModalSecondContext);
  
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { masterSwitch, setMasterSwitch } = useContext(MasterContext);

  const largeModalY = useSharedValue(-windowHeight);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: largeModalY.value }],
    };
  });

  const startLargeModalAnimation = () => {
    if (largeModalY.value === windowHeight) {
      largeModalY.value = withTiming(-windowHeight * 1.1);
    } else {
      largeModalY.value = withTiming(windowHeight);
      if (masterSwitch) {
        setAddSiteVals({
          ...addSiteVals,
          Site: "",
          Latitude: "",
          Longitude: "",
        });
      }
    }
  };

  useEffect(() => {
    let timout;
    windowHeight > 1000 ? (timout = 900) : (timout = 400);
    if (
      largeModalY.value === -windowHeight * 1.1 &&
      activeButtonID !== previousButtonID
    ) {
      startLargeModalAnimation();
      setTimeout(() => {
        startLargeModalAnimation();
      }, 315);
      return;
    } else {
      setTimeout(() => {
        startLargeModalAnimation();
        setLargeModalSecond(false);
      setSmallModal(false);
      }, 100);
      return;
    }
  }, [largeModal]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeButtonID === "DiveSiteAdderButton" && <DiveSiteModal />}
      {activeButtonID === "SettingsButton" && <SettingsModal />}
      {activeButtonID === "TutorialsButton" && <TutorialLaunchPadModal />}
      {activeButtonID === "ItineraryListButton" && <ItineraryListModal />}

      {activeButtonID === "SiteAnchorIcon" && <AnchorModal />}
      {activeButtonID === "ShopMaskIcon" && <ShopModal />}

      
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
    backgroundColor: "#538bdb",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    zIndex: 25,
  },
});
