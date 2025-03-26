import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
  authenicationButton,
  buttonText,
  screenSecondaryButton,
  buttonTextAlt,
} from '../../styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const FullScreenCenter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

export const BackButton = styled.View`
  z-index: 50;
  position: absolute;
  top: 5.5%;
  left: 2%;
`;

export const ContentContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 15;
  margin-top: ${Platform.OS === 'ios' ? windowHeight / 2.4 : windowHeight / 2.2}px;
  align-items: center;
`;

export const Header = styled.Text`
  z-index: -1;
  margin: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
  align-self: flex-start;
`;

export const TextBuffer = styled.View`
  margin-bottom: ${moderateScale(20)}px;
`;

export const ButtonBox = styled.View`
  z-index: -1;
  width: 100%;
  align-items: flex-end;
  margin-top: -15%;
  margin-right: 15%;
`;

export const ButtonOptions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 84%;
`;

export const LocationButton = styled.View`
  ${screenSecondaryButton};
  flex-direction: row;
  margin-top: 0%;
`;

export const LocationText = styled.Text`
  ${buttonTextAlt};
  margin-horizontal: ${moderateScale(5)}px;
  font-size: ${fontSizes.StandardText}px;
`;

export const PinButton = styled.View`
  ${screenSecondaryButton};
  flex-direction: row;
  margin-top: 0%;
`;

export const PinText = styled.Text`
  ${buttonTextAlt};
  margin-horizontal: ${moderateScale(5)}px;
`;

export const Explainer = styled.Text`
  align-self: flex-start;
  text-align: center;
  color: ${colors.themeBlack};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.ThinItalic};
  margin-top: 2%;
  margin-left: ${windowWidth > 600 ? '5%' : '9%'};
  margin-bottom: 0%;
  width: 30%;
`;

export const SubmitButton = styled.View`
  ${authenicationButton};
  flex-direction: row;
  margin-top: ${windowHeight / 10}px;
`;

export const SubmitText = styled.Text`
  ${buttonText};
  margin-horizontal: ${moderateScale(5)}px;
`;

export const SvgCurve = {
  position: 'absolute',
  bottom: 0,
  width: Dimensions.get('window').width,
};

export const BackButtonWrapper = styled.View`
  z-index: 50;
  position: absolute;
  top: 5.5%;
  left: 2%;
`;