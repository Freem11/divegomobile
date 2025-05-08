import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../styles';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('window').height;

export const FullScreenCenter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
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
`;

export const TopButtonBox = styled.View`
  z-index: 20;
  margin-right: 7%;
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
  align-self: flex-end;
`;

export const Header = styled.Text`
  margin-left: 5%;
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: flex-start;
`;

export const InputGroupContainer = styled.View`
  width: ${windowWidth * 0.8}px;
  margin-top: ${moderateScale(10)}px;
`;


export const TextBuffer = styled.View`
  margin-top: ${moderateScale(20)}px;
  margin-bottom: ${moderateScale(10)}px;
  margin-left: 1%;
  width: 98%;
`;

export const TextBufferDates = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${moderateScale(20)}px;
  margin-bottom: ${moderateScale(50)}px;
  width: 99%;
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
  text-align: center;
  height: 99%;
`;

export const DescriptionBox = styled.View`
  align-items: center;
  justify-content: center;
  borderWidth: ${moderateScale(1)}px;
  borderColor: ${colors.neutralGrey};
  borderRadius: ${moderateScale(10)}px;
  margin-top: 4%;
  background-color: ${colors.themeWhite};
  margin-bottom: ${moderateScale(50)}px;
  height: ${moderateScale(300)}px;
`;

export const BottomButtonBox = styled.View`
  margin-top: ${moderateScale(40)}px;
  align-items: flex-end;
`;

export const ScrollViewContainer = styled.View`
  height: ${moderateScale(300)}px;
  margin-top: 2%; 
  margin-bottom: 1%;
  border-color: ${colors.neutralGrey};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(10)}px;
`;

export const ListItemContainer = styled.View`
  width: 94%;
  margin-left: 3%;
  margin-vertical: ${moderateScale(4)}px;
`;

export const ItemHousing = styled.View`
  padding-bottom: ${moderateScale(24)}px;
`;

export const VerticalLine = styled.View`
  position: absolute;
  top: ${moderateScale(49)}px;
  left: ${moderateScale(24.5)}px;
  bottom: ${moderateScale(-10)}px;
  width: ${moderateScale(2)}px;
  background-color: ${colors.neutralGrey};
`;

export const ButtonHousing = styled.View`
  position: absolute;
  bottom: ${moderateScale(20)}px;
  right: ${moderateScale(20)}px;
`;