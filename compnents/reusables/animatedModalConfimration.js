import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveConfirmationIDContext } from '../contexts/activeConfirmationIDContext';
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";

import FailModal from "../modals/confirmationCautionModal";
import SuccessModal from "../modals/confirmationSuccessModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalConfirmation(props) {
  const { activeConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID } = useContext(PreviousButtonIDContext);
  const { smallModal, setSmallModal } = useContext(SmallModalContext);
  const { confirmationModal, setConfirmationModal } = useContext(
    ConfirmationModalContext
  );
  const { setLargeModal } = useContext(LargeModalContext);
  const { setLargeModalSecond } = useContext(LargeModalSecondContext);

  const [confirmationType, setConfirmationType] = useState(true);

  const confirmationModalY = useSharedValue(-windowHeight);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: confirmationModalY.value }],
    };
  });

  const startSmallModalAnimation = () => {
    if (confirmationModalY.value === windowHeight) {
      confirmationModalY.value = withTiming(-windowHeight * 1.1);
    } else {
      confirmationModalY.value = withTiming(windowHeight);
    }
  };

  useEffect(() => {
    if (confirmationModal) {
      confirmationModalY.value = withTiming(-windowHeight * 1.1);
    } else {
      confirmationModalY.value = withTiming(windowHeight);
    }
  }, [confirmationModal]);

  return (
    <Animated.View
      style={[
        styles.modalBody,
        modalSlide
      ]}
    >
      {activeConfirmationID === "ConfirmationCaution" && <FailModal />}
      {activeConfirmationID === "ConfirmationSuccess" && <SuccessModal />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    position: "absolute",
    bottom: -windowHeight + windowHeight * 0.3,
    height: windowHeight - windowHeight * 0.55,
    width: windowWidth - windowWidth * 0.2,
    marginLeft: windowWidth * 0.05,
    borderRadius: moderateScale(25),
    borderWidth: moderateScale(2),
    borderColor: "darkgrey",
    zIndex: 25,
  },
});
