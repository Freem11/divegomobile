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
    height: 100%;
`;

export const BackButtonWrapper = styled.View`
  z-index: 50;
  position: absolute;
  top: 5%;
  left: 0%;
`;

export const ContentContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 15;
  margin-top: ${Platform.OS === 'ios' ? windowHeight / 2.4 : windowHeight / 2.2}px;
  align-items: center;;
`;

export const InputGroupContainer = styled.View`
  margin-bottom: ${windowHeight / 70}px;
  width: ${windowWidth * 0.75}px;
`;

export const Header = styled.Text`
  margin: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.neutralGrey};
  align-self: flex-start;
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
  height: 100%;
  padding: ${moderateScale(10)}px;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light}
`;

export const TopButtonBox = styled.View`
  z-index: -1;
  width: 100%;
  align-items: flex-end;
  margin-top: ${Platform.OS === 'ios' ? moderateScale(50) : '2%'};
  margin-left: 53%;
`;

export const DescriptionBox = styled.View`
  alignItems: center;
  justifyContent: flex-start;
  borderWidth: ${moderateScale(1)}px;
  borderColor: ${colors.neutralGrey};
  borderRadius: ${moderateScale(10)}px;
  marginTop: 4%;
  height: ${windowWidth > 600 ? '13%' : '23%'} ;
  background-color: ${colors.themeWhite}
`;

export const BottomButtonBox = styled.View`
  marginTop: 5%;
  align-items: flex-end;
`;