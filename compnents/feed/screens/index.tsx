import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../../styles";
import { useFeedScreenStore } from "../store/useScreenStore";
import FeedList from "./feeds";
import { FEED_SCREEN } from "../store/types";
import { useNotificationsStore } from "../store/useNotificationsStore";

const { width: windowWidth, height: windowHeight } = Dimensions.get("screen");

// TODO VLAD: change FeedScreens to more generic
export default function FeedScreens() {
  const currentScreen = useFeedScreenStore((state) => state.currentScreen);
  const isVisible = useFeedScreenStore((state) => state.isVisible);
  const levelOneScreenY = useSharedValue(windowHeight);

  const loadFirst = useNotificationsStore((s) => s.loadFirst);

  const modalSlide = useAnimatedStyle(() => ({
    transform: [{ translateY: levelOneScreenY.value }],
  }));

  useEffect(() => {
    levelOneScreenY.value = withTiming(isVisible ? 0 : windowHeight, {
      duration: 300,
    });
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && currentScreen === FEED_SCREEN.NOTIFICATIONS) {
      loadFirst();
    }
  }, [isVisible, currentScreen]);

  const renderContent = () => {
    switch (currentScreen) {
      case FEED_SCREEN.FEED_MESSAGES:
        return <FeedList />;
      case FEED_SCREEN.NOTIFICATIONS:
        return <FeedList />;
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.modalBody, modalSlide]}>
      {renderContent()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    position: "absolute",
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: colors.themeWhite,
    zIndex: 50,
  },
});
