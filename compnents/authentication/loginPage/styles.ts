import styled from "styled-components/native";
import { Dimensions } from "react-native";
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
  background-color: ${colors.primaryBlue};
`;

export const HeaderContainer = styled.View`
  flex: 0.25;
  justify-content: flex-end;
  padding-left: 24px;
  padding-bottom: 32px;
`;

export const ContentContainer = styled.View<{ paddingBottom: number }>`
  flex: 0.75;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding-bottom: ${({ paddingBottom }) => paddingBottom}px;
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
  color: ${colors.themeWhite};
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
`;

export const ForgotBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
`;

export const PromptBox = styled.View`
  width: 100%;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
`;

export const PromptText = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Italic};
  color: ${colors.themeBlack};
`;

export const PromptLinkText = styled.Text`
  margin-top: ${moderateScale(1)}px;
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
