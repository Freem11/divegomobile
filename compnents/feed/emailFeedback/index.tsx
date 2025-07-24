import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { moderateScale, s } from "react-native-size-matters";
import email from "react-native-email";

import { EmailView } from "./view";

export const EmailFeedback = () => {

  const feedbackX = useSharedValue(0);
  const feedbackReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: feedbackX.value }],
    };
  });

  const handleEmail = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      subject: "Scuba SEAsons Feedback Submission",
      body: "",
      checkCanOpen: false,
    }).catch(console.error);
  };

  const startFeedbackAnimations = () => {
    if (feedbackX.value === 0) {
      feedbackX.value = withSpring(moderateScale(250));
    } else {
      feedbackX.value = withTiming(0);
    }
  };

  return (
    <EmailView
      feedbackReveal={feedbackReveal}
      handleEmail={handleEmail}
      startFeedbackAnimations={startFeedbackAnimations}
    />
  );
};
