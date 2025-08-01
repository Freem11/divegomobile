import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import {
  fontSizes,
  activeFonts,
  buttonText,
  authenicationButton,
  colors,
} from "../../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  margin-top: ${windowHeight / 10}px;
  margin-bottom: ${windowHeight / 25}px;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  margin-horizontal: 7%;
`;

export const TopInputWrapper = styled.View`
  margin-top: ${moderateScale(60)}px;
`;

export const Header = styled.Text`
  z-index: 10;
  margin-top: 10%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: darkgrey;
`;

export const ErrorText = styled.Text`
  min-height: ${moderateScale(34)}px;
  margin-top: ${moderateScale(15)}px;
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Italic};
  color: maroon;
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
`;

export const LoginButton = styled.View`
  ${authenicationButton};
  width: 65%;
  flex-direction: row;
  margin-top: ${windowHeight / 10}px;
  padding-horizontal: 15px;
`;

export const LoginText = styled.Text`
  ${buttonText};
  margin-horizontal: ${moderateScale(5)}px;
`;
