import styled from "styled-components/native";
import { Dimensions, Platform, SafeAreaView, StyleSheet } from "react-native";
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
  background-color: ${colors.primaryBlue};
`;

export const HeaderContainer = styled.View`
  flex: 0.25;
  justify-content: flex-end;
  padding-left: 24px;
  padding-bottom: 32px;
`;

export const ContentContainer = styled.View`
  flex: 0.75;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
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
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.themeWhite};
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
