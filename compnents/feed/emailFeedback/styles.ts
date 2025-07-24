import styled from "styled-components/native";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors } from "../../styles";

const windowWidth = Dimensions.get("window").width;
const FbWidth = moderateScale(350);

export const inline = StyleSheet.create({
  feedback: {
    zIndex: 2,
    flexDirection: "row",
    backgroundColor: colors.primaryBlue,
    position: "absolute",
    top: -moderateScale(160),
    left: -0.88 * FbWidth,
    padding: moderateScale(5),
    borderTopRightRadius: moderateScale(15),
    borderBottomRightRadius: moderateScale(15),
    width: windowWidth > 600 ? FbWidth + moderateScale(20) : FbWidth,
    height: moderateScale(39),
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 10,
  },
  touchable: {
    width: moderateScale(30),
    height: moderateScale(23),
    marginTop: moderateScale(3),
  },
});

export const FMenuAnimate = styled.View`
  position: absolute;
  bottom: ${Platform.OS === "ios" ? moderateScale(15) : moderateScale(45)}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
`;

export const FeedRequest = styled.Text`
  color: ${colors.themeWhite};
  font-family: ${activeFonts.ThinItalic};
  font-size: ${moderateScale(18)}px;
  margin-top: ${moderateScale(3)}px;
  margin-right: ${moderateScale(10)}px;
  margin-left: ${moderateScale(14)}px;
  padding-left: ${moderateScale(50)}px;
`;
