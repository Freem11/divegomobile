import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  activeFonts,
  colors,
  fontSizes,
  authenicationButton,
  buttonText,
} from '../../styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  margin-top: ${windowHeight / 10}px;
  margin-bottom: ${windowHeight / 25}px;
  width: ${windowWidth - windowWidth / 10}px;
`;

export const Content = styled.View`
  margin-horizontal: 7%;
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
  margin-top: ${moderateScale(-50)}px;
`;

export const ForgotBox = styled.View`
  position: absolute;
  bottom: ${moderateScale(40)}px;
  width: 100%;
  flex-direction: row;
  justify-content: center;
`;

export const PromptBox = styled.View`
  position: absolute;
  bottom: ${moderateScale(10)}px;
  width: 100%;
  flex-direction: row;
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
  font-family: ${activeFonts.Thin};
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
