import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { useActiveScreenStore } from '../../store/useActiveScreenStore';
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import UserProfileParallax from '../screens/userProfile/userProfileParallax';
import PicUploaderParallax from '../screens/picUploader/picUploaderParallax';
import SiteSubmitterParallax from '../screens/diveSiteUploader/siteSubmitterParallax';
import TripCreatorParallax from '../screens/tripCreator/tripCreatorParallax';
import { colors } from "../styles";
import PartnerRequestParallax from "../screens/partnerAccountRequest/partnerRequestParallax";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

export default function LevelTwoScreen() {
  const activeScreen2 = useActiveScreenStore((state) => state.activeScreen);

  const { activeScreen } = useContext(ActiveScreenContext);
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);

  const levelTwoScreenY = useSharedValue(0);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: levelTwoScreenY.value }],
    };
  });

  const startlevelTwoScreenAnimation = () => {
    if (levelTwoScreenY.value === 0) {
      levelTwoScreenY.value = withTiming(windowHeight);
    } else {
      levelTwoScreenY.value = withTiming(0);
    }
  };

  useEffect(() => {
    startlevelTwoScreenAnimation();
  }, [levelTwoScreen]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeScreen2 && activeScreen2.screenName === "ProfileScreen" && <UserProfileParallax profileID={activeScreen2.params.id}/>}
      {activeScreen2 && activeScreen2.screenName === "PartnerRequestScreen" && <PartnerRequestParallax />}
      {activeScreen2 && activeScreen2.screenName === "PictureUploadScreen" && <PicUploaderParallax selectedDiveSite={activeScreen2.params.id}/>}
      {activeScreen2 && activeScreen2.screenName === "DiveSiteUploadScreen" && <SiteSubmitterParallax />}
      {activeScreen2 && activeScreen2.screenName === "TripCreatorScreen" && <TripCreatorParallax shopID={activeScreen2.params.id}/>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    backgroundColor: colors.themeWhite,
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 50,
    left: 0,
  },
});
