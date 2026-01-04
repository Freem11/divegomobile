import styled from "styled-components/native";
import { Dimensions, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";

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
  margin-top: ${windowHeight / 200}px;
  margin-bottom: ${windowHeight / 25}px;
`;

export const TextInputWrapper = styled.View`
  margin-top: ${moderateScale(60)}px;
`;

export const SecureTextInputWrapper = styled.View`
  margin-top: ${moderateScale(40)}px;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  margin-horizontal: 7%;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: darkgrey;
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
`;

export const ForgotBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  padding-bottom: ${moderateScale(16)}px;
`;

export const PromptBox = styled.View`
  width: 100%;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding-bottom: ${Platform.OS === "ios" ? 0 : "15px"};
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
