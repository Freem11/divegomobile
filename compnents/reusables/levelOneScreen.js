import React, { useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActiveScreenContext } from '../contexts/activeScreenContext';
import { useActiveScreenStore } from '../../store/useActiveScreenStore';
import { LevelOneScreenContext } from '../contexts/levelOneScreenContext';
import { colors } from "../styles";
import DiveSiteParallax from '../screens/diveSite/diveSiteParallax';
import DiveShopParallax from '../screens/diveShop/diveShopParallax';
import Settings from '../screens/settings';
import SearchPage from '../screens/search';
import TripListPage from '../screens/tripList';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

export default function LevelOneScreen() {
  const activeScreen2 = useActiveScreenStore((state) => state.activeScreen);


  const { activeScreen } = useContext(ActiveScreenContext);
  const { levelOneScreen } = useContext(LevelOneScreenContext);
  const levelOneScreenY = useSharedValue(0);

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: levelOneScreenY.value }],
    };
  });

  const startLevelOneScreenAnimation = () => {
    if (levelOneScreenY.value === 0) {
      levelOneScreenY.value = withTiming(windowHeight);
    } else {
      levelOneScreenY.value = withTiming(0);
    }
  };

  useEffect(() => {
    startLevelOneScreenAnimation();
  }, [levelOneScreen]);

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {activeScreen2 && activeScreen2.screenName === "DiveSiteScreen" && <DiveSiteParallax siteID={activeScreen2.params.id}/>}
      {activeScreen2 && activeScreen2.screenName === "DiveShopScreen" && <DiveShopParallax shopID={activeScreen2.params.id}/>}
      {activeScreen2 && activeScreen2.screenName === "SettingsScreen" && <Settings/>}
      {activeScreen === "SearchScreen" && <SearchPage/>}
      {activeScreen === "TripListScreen" && <TripListPage/>}
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
