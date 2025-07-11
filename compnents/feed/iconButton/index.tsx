import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { moderateScale, s } from "react-native-size-matters";

import { useFeedScreenStore } from "../store/useScreenStore";
import { FEED_SCREEN } from "../store/types";

import { FeedsView } from "./view";

export const FeedsButton = () => {
  const openScreen = useFeedScreenStore((state) => state.openScreen);
  const feedbackX = useSharedValue(0);
  const feedbackReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: feedbackX.value }],
    };
  });

  const handleOnClick = () => {
    openScreen(FEED_SCREEN.FEED_MESSAGES)
  };

  const startFeedbackAnimations = () => {
    if (feedbackX.value === 0) {
      feedbackX.value = withSpring(moderateScale(250));
    } else {
      feedbackX.value = withTiming(0);
    }
  };

  return (
    <FeedsView
      feedbackReveal={feedbackReveal}
      onClick={handleOnClick}
      startFeedbackAnimations={startFeedbackAnimations}
    />
  )
};
