import styled from 'styled-components/native';
import { activeFonts, colors, fontSizes } from "../../styles";
import { moderateScale } from 'react-native-size-matters'
import { Dimensions, Platform } from "react-native";

const windowWidth = Dimensions.get('window').width;

export const ScrollViewContainer = styled.View`
    height: ${windowWidth > 600 ? '35%' : '50%'};
    margin-top: 2%; 
    margin-bottom: 1%;
    border-color: ${colors.neutralGrey};
    border-width: ${moderateScale(1)}px;
    border-style: dotted;
    border-radius: ${moderateScale(5)}px;
`;

export const BackButtonWrapper = styled.View`
  z-index: 50;
  position: absolute;
  top: 5%;
  left: 2%;
`;

export const Header = styled.Text`
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.neutralGrey};
  align-self: flex-start;
`;

export const TopButtonBox = styled.View`
  z-index: -1;
  width: 100%;
  align-items: flex-end;
  margin-top: ${Platform.OS === 'ios' ? moderateScale(50) : '2%'};
  margin-left: -5%;
`;

export const BottomButtonBox = styled.View`
  width: 100%;
  position: absolute;
  bottom: 3.5%;
  left: 58%;
`;

export const ListItemContainer = styled.View`
  width: 94%;
  margin-left: 3%;
  margin-vertical: ${moderateScale(4)}px;
`;

export const ItemHousing = styled.View`
  padding-bottom: ${moderateScale(24)}px;
`;

export const ButtonHousing = styled.View`
  position: absolute;
  bottom: ${moderateScale(20)}px;
  right: ${moderateScale(20)}px;
`

export const VerticalLine = styled.View`
  position: absolute;
  top: ${moderateScale(49)}px;
  left: ${moderateScale(24.5)}px;
  bottom: ${moderateScale(-10)}px;
  width: ${moderateScale(2)}px;
  background-color: ${colors.neutralGrey};
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

