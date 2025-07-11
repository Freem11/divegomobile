import styled from "styled-components/native";
import { Dimensions, Platform, SafeAreaView, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import Animated from "react-native-reanimated";

import {
  colors,
  fontSizes,
  buttonText,
  activeFonts,
  authenicationButton,
} from "../../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  margin-top: ${windowHeight / 10}px;
  margin-bottom: ${windowHeight / 25}px;
  width: ${windowWidth - windowWidth / 10}px;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: -50%;
  margin-horizontal: 7%;
`;

export const SafeArea = styled(SafeAreaView)`
z-index: 20;
margin-top: ${Platform.OS === "ios" ? 0 : "10%"};
background-color: ${colors.neutralGrey};
`;

export const AnimatedSafeArea = Animated.createAnimatedComponent(SafeArea);

export const BackButtonWrapper = styled.View`
width: 50%;
align-items: flex-start;
`;

export const TopInputWrapper = styled.View`
   margin-top: ${moderateScale(60)}px;
`;

export const TextInputWrapper = styled.View`
   margin-top: ${moderateScale(40)}px;
`;


export const Header = styled.Text`
  z-index: 10;
  margin-top: 10%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: darkgrey;
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
`;

export const PromptBox = styled.View`
  position: absolute;
  bottom: ${moderateScale(10)}px;
  width: 100%;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
`;

export const PromptText = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Italic};
  color: ${colors.themeBlack};
`;

export const PromptLinkText = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  color: ${colors.primaryBlue};
`;

export const LoginButton = styled.View`
  ${authenicationButton};
  flex-direction: row;
  margin-top: ${windowHeight / 10}px;
`;

export const LoginText = styled.Text`
  ${buttonText};
  margin-horizontal: ${moderateScale(5)}px;
`;

export const ErrorText = styled.Text`
  min-height: ${moderateScale(34)}px;
  margin-top: ${moderateScale(15)}px;
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Italic};
  color: maroon;
`;

export const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: "hidden",
  },
  safeArea: {
    zIndex: 20,
    marginTop: Platform.OS === "ios" ? 0 : "10%",
    flexDirection: "row",
    alignItems: "center"
  }
});