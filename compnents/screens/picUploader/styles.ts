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

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.themeWhite};
  align-items: center;
  justify-content: center;
  height: ${windowHeight}px;
`;

export const BackButton = styled.View`
  position: absolute;
  top: 5.5%;
  left: 2%;
  z-index: 50;
`;

export const ContentContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 15;
  margin-top: ${Platform.OS === "ios"
    ? windowHeight / 2.4
    : windowHeight / 2.2}px;
  width: 100%;
  align-items: center;
`;

export const Header = styled.Text`
  margin: 5% 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
  align-self: flex-start;
`;

export const Label = styled.Text`
  margin-left: -5%;
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.LightItalic};
`;

export const InputBlock = styled.View`
  margin-bottom: ${moderateScale(20)}px;
  width: 75%;
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: ${windowWidth > 600 ? "-15%" : "-20%"};
  margin-right: 15%;
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
