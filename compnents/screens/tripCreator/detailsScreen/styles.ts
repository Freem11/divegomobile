import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../../styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const FullScreenCenter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

export const PageContentContainer = styled.View`
    width: 90%; 
`;

export const BackButtonWrapper = styled.View`
  z-index: 50;
  position: absolute;
  top: 5%;
  left: 0%;
`;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  align-items: center;
  padding-bottom: ${moderateScale(20)}px;
`;

export const TopButtonBox = styled.View`
  z-index: 20;
  margin-left: 5%;
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
  align-self: flex-start;
`;

export const Header = styled.Text`
  margin-left: 5%;
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
  align-self: flex-start;
`;

export const InputGroupContainer = styled.View`
  width: ${windowWidth * 0.8}px;
`;


export const TextBuffer = styled.View`
  margin-bottom: ${moderateScale(20)}px;
  margin-left: 1%;
  width: 98%;
`;

export const TextBufferDates = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${moderateScale(20)}px;
  width: 96%;
`;

export const TextLabelDates = styled.View`
  flex-direction: column;
  justify-content: center;
  width: 48%;
`;

export const MultilineTextInput = styled.TextInput`
  padding: ${moderateScale(10)}px;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light};
`;

export const DescriptionBox = styled.View`
  alignItems: center;
  justifyContent: flex-start;
  borderWidth: ${moderateScale(1)}px;
  borderColor: ${colors.neutralGrey};
  borderRadius: ${moderateScale(10)}px;
  marginTop: 4%;
  background-color: ${colors.themeWhite}
`;

export const BottomButtonBox = styled.View`
  marginTop: 5%;
  align-items: flex-end;
`;