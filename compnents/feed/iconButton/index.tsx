import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { moderateScale, s } from "react-native-size-matters";
import { FeedsView } from "./view";

export const FeedsButton = () => {

  const feedbackX = useSharedValue(0);
  const feedbackReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: feedbackX.value }],
    };
  });

  const handleOnClick = () => {
      console.log("button pressed");
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
