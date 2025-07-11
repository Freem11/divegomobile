import styled from "styled-components/native";
import { Dimensions, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
  activeFonts,
  authenicationButton,
  buttonText,
} from "../../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  align-items: center;
`;

export const Header = styled.Text`
  margin-left: 5%;
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: flex-start;
`;

export const InputGroupContainer = styled.View`
  margin-bottom: ${windowHeight / 70}px;
  width: ${windowWidth * 0.75}px;
 
`;

export const TextBuffer = styled.View`
  margin-bottom: ${moderateScale(20)}px;
  width: ${windowWidth * 0.75}px;
`;

export const Label = styled.Text`
  margin-left: -5%;
  color: ${colors.headersBlue};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.MediumItalic};
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: ${Platform.OS === "ios" ? "15%" : "2%"};
  padding-horizontal: 7%;
`;

export const SubmitButton = styled.TouchableOpacity`
  ${authenicationButton};
  flex-direction: row;
  margin-top: ${windowHeight / 10}px;
`;

export const SubmitText = styled.Text`
  ${buttonText};
  margin-horizontal: ${moderateScale(5)}px;
`;

export const TouchOverlay = styled.Pressable``;

export const TouchWrapper = styled.View``;

export const svgCurve = {
  position: "absolute",
  bottom: 0,
  width: windowWidth,
};


export const UploadZone = styled.View`
  flex: 1;
   width: ${windowWidth};
  background-color: ${colors.primaryBlue};
  align-items: center;
  justify-content: center;
`;