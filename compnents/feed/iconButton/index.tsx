// import React from "react";
// import FeedbackMenuView from "./view";
// import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// export default function FeedbackMenu() {
//   const reveal = useSharedValue(0);

//   const feedbackReveal = useAnimatedStyle(() => ({
//     opacity: reveal.value,
//     transform: [{ translateY: withTiming(reveal.value === 1 ? 0 : -20) }],
//   }));

//   const startFeedbackAnimations = () => {
//     reveal.value = reveal.value === 0 ? 1 : 0;
//   };

//   const handleEmail = () => {
//     // Add your email logic here
//     console.log("Sending email...");
//   };

//   return (
//     <FeedbackMenuView
//       feedbackReveal={feedbackReveal}
//       startFeedbackAnimations={startFeedbackAnimations}
//       handleEmail={handleEmail}
//     />
//   );
// }
