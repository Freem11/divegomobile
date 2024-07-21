import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { PinContext } from "../contexts/staticPinContext";
import { MasterContext } from "../contexts/masterContext";

import UserProfileModal from "../modals/userProfileModal";
import PartnerAccountRequestModal from "../modals/partnerAccountRequestModal";
import PicUploadModal from "../modals/picUploaderModal";
import TripCreatorModal from '../modals/tripCreatorModal';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalLargeSecond(props) {
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModalSecond } = useContext(LargeModalSecondContext);
  const { setSmallModal } = useContext(SmallModalContext);
  const { setLargeModal } = useContext(LargeModalContext);
  
  const { pinValues, setPinValues } = useContext(PinContext);
  const { masterSwitch, setMasterSwitch } = useContext(MasterContext);

  const largeSecondModalY = useSharedValue(-windowHeight);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: largeSecondModalY.value }],
    };
  });

  const startLargeModalAnimation = () => {
    if (largeSecondModalY.value === windowHeight) {
      largeSecondModalY.value = withTiming(-windowHeight * 1.1);
    } else {
      largeSecondModalY.value = withTiming(windowHeight);
      if (masterSwitch) {
        setPinValues({
          ...pinValues,
          PicFile: null,
          Animal: "",
          PicDate: "",
          Latitude: "",
          Longitude: "",
          DDVal: "0",
        });
      }
    }
  };


  useEffect(() => {
  if(largeModalSecond){
    largeSecondModalY.value = withTiming(-windowHeight * 1.1);
  } else {
    largeSecondModalY.value = withTiming(windowHeight);
  }
  }, [largeModalSecond]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeButtonID === "UserProfileButton" && <UserProfileModal />}
      {activeButtonID === "PartnerAccountButton" && <PartnerAccountRequestModal />}
      {activeButtonID === "PictureAdderButton" && <PicUploadModal />}
      {activeButtonID === "TripCreator" && <TripCreatorModal />}
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
