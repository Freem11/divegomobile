// // FeedbackMenu/styles.ts
// import styled from "styled-components/native";
// import { Platform, Dimensions } from "react-native";
// import { moderateScale } from "react-native-size-matters";
// import { colors, activeFonts } from "../../styles";

// const windowWidth = Dimensions.get("window").width;
// const FbWidth = moderateScale(350);

// export const FMenuAnimate = styled.View`
//   position: absolute;

//   bottom: ${Platform.OS === "ios" ? moderateScale(15) : moderateScale(0)}px;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   z-index: 5;
// `;

// export const FeedbackAnimatedWrapper = styled.View`
//   z-index: 20;
//   border: 1px solid red;
//   flex-direction: row;
//   background-color: ${colors.primaryBlue};
//   position: absolute;
//   top: ${-moderateScale(130)}px;
//   left: ${-0.88 * FbWidth}px;
//   padding: ${moderateScale(5)}px;
//   border-top-right-radius: ${moderateScale(15)}px;
//   border-bottom-right-radius: ${moderateScale(15)}px;
//   width: ${windowWidth > 600 ? FbWidth + moderateScale(20) : FbWidth}px;
//   height: ${moderateScale(39)}px;
//   shadow-color: #000;
//   shadow-offset: 8px 8px;
//   shadow-opacity: 0.6;
//   shadow-radius: 5px;
//   elevation: 10;
// `;

// export const FeedbackText = styled.Text`
//   color: ${colors.themeWhite};
//   font-family: ${activeFonts.ThinItalic};
//   font-size: ${moderateScale(18)}px;
//   margin-top: ${moderateScale(3)}px;
//   margin-right: ${moderateScale(10)}px;
//   margin-left: ${moderateScale(14)}px;
//   padding-left: ${moderateScale(50)}px;
// `;

// export const PaperPlaneButton = styled.TouchableOpacity`
//   width: ${moderateScale(30)}px;
//   height: ${moderateScale(23)}px;
//   margin-top: ${moderateScale(3)}px;
//   justify-content: center;
//   align-items: center;
// `;
