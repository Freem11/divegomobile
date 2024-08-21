import React, { useEffect, useContext, useLayoutEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import UserProfileModal from "../modals/userProfileModal";
import PartnerAccountRequestModal from "../modals/partnerAccountRequestModal";
import PicUploadModal from "../modals/picUploaderModal";
import TripCreatorModal from '../modals/tripCreatorModal';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnimatedModalLargeSecond(props) {
  const { activeButtonID } = useContext(ActiveButtonIDContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(LargeModalSecondContext);
  
  const largeSecondModalY = useSharedValue(-windowHeight);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: largeSecondModalY.value }],
    };
  });

  useLayoutEffect(() => {
      setLargeModalSecond(false)
    }, []);
  

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
    bottom: -windowHeight * 1.05,
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
