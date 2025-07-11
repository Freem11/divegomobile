import React, { useEffect, useContext, useLayoutEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import FailModal from "../modals/confirmationCautionModal";
import SuccessModal from "../modals/confirmationSuccessModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalConfirmation(props) {
  const { activeConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { confirmationModal, setConfirmationModal } = useContext(
    ConfirmationModalContext
  );
  const confirmationModalY = useSharedValue(-windowHeight);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: confirmationModalY.value }],
    };
  });

  useEffect(() => {
    if (confirmationModal) {
      confirmationModalY.value = withTiming(-windowHeight * 1.1);
    } else {
      confirmationModalY.value = withTiming(windowHeight);
    }
  }, [confirmationModal]);


  useLayoutEffect(() => {
    setConfirmationModal(false)
  }, []);
  
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
    zIndex: 55,
  },
});
