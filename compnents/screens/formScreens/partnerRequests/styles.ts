import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const FullScreenCenter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const BackButton = styled.View`
  z-index: 50;
  position: absolute;
  top: 5.5%;
  left: 2%;
`;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  align-items: center;
`;

export const InputGroupContainer = styled.View`
  margin-bottom: ${windowHeight / 70}px;
  width: ${windowWidth * 0.75}px;
`;

export const Header = styled.Text`
  margin-left: 5%;
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: flex-start;
`;

export const TextBuffer = styled.View`
  margin-bottom: ${moderateScale(20)}px;
`;

export const ButtonSpread = styled.View`
  flex-direction: row;
  width: ${windowWidth}px;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 7%;
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: ${Platform.OS === 'ios' ? '15%' : '2%'};
  padding-horizontal: 7%;
`;

export const Hint = styled.Text`
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

export const BackButtonWrapper = styled.View`
  z-index: 50;
  position: absolute;
  top: 5.5%;
  left: 2%;
`;

export const MainExplainer = styled.Text`
  margin-vertical: 5%;
  margin-horizontal: 5%;
  margin-bottom: 10%;
  text-align: center;
  font-size: ${moderateScale(fontSizes.SmallText)};
  font-family: ${activeFonts.Bold};
  color: ${colors.primaryBlue};
`;

export const Buffer = styled.Text`
  margin-bottom: ${moderateScale(5)}px;
`;

export const Explainer = styled.Text`
  margin-top: ${moderateScale(-15)}px;
  margin-bottom: ${moderateScale(25)}px;
  text-align: center;
  font-size: ${moderateScale(fontSizes.SmallText)};
  font-family: ${activeFonts.ThinItalic};
  color: ${colors.themeBlack};
`;