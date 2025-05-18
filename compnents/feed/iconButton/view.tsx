// // FeedbackMenu/view.tsx
// import React from "react";
// import { Octicons } from "@expo/vector-icons";
// import * as S from "./styles";
// import Animated from "react-native-reanimated";
// import { moderateScale } from "react-native-size-matters";

// type Props = {
//   feedbackReveal: any;
//   startFeedbackAnimations: () => void;
//   handleEmail: () => void;
// };

// export default function FeedbackMenuView({
//   feedbackReveal,
//   startFeedbackAnimations,
//   handleEmail,
// }: Props) {
//   return (
//     <S.FMenuAnimate pointerEvents="box-none">
//       <Animated.View style={feedbackReveal}>
//         <S.FeedbackAnimatedWrapper>
//           {console.log("Feedback menu opened")}
//           <S.FeedbackText onPress={handleEmail}>
//             Send Scuba SEAsons feedback
//           </S.FeedbackText>
//           <S.PaperPlaneButton onPress={startFeedbackAnimations}>
//             <Octicons
//               name="paper-airplane"
//               size={moderateScale(24)}
//               color="white"
//             />
//           </S.PaperPlaneButton>
//         </S.FeedbackAnimatedWrapper>
//       </Animated.View>
//     </S.FMenuAnimate>
//   );
// }
