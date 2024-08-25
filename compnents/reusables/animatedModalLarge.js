import React, { useEffect, useContext, useLayoutEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import DiveSiteModal from "../modals/diveSiteAdderModal";
import SettingsModal from "../modals/settingsModal";
import TutorialLaunchPadModal from "../modals/tutorialsModal";
import ItineraryListModal from "../modals/itineraryListModal";
import AnchorModal from "../modals/anchorModal";
import ShopModal from "../modals/shopModal";

import DiveSiteSearchModal from "../modals/diveSiteSearchModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalLarge(props) {
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);

  const largeModalY = useSharedValue(-windowHeight);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: largeModalY.value }],
    };
  });

  useLayoutEffect(() => {
    setLargeModal(false);
  }, []);

  useEffect(() => {
    if (largeModal) {
      largeModalY.value = withTiming(-windowHeight * 1.1);
    } else {
      largeModalY.value = withTiming(windowHeight);
    }
  }, [largeModal]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeButtonID === "DiveSiteSearchButton" && <DiveSiteSearchModal />}
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
    bottom: -windowHeight * 1.05,
    height: windowHeight - windowHeight * 0.1,
    width: windowWidth - windowWidth * 0.1,
    marginLeft: windowWidth * 0.05,
    backgroundColor: "#0073E6",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    zIndex: 25,
  },
});
