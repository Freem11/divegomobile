import styled from 'styled-components/native';
import { activeFonts, buttonSizes, colors, fontSizes } from "../../styles";
import { moderateScale } from 'react-native-size-matters'
import Animated from 'react-native-reanimated';
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;

export const ScrollViewContainer = styled.View`
    width: 100%; 
    marginTop: 12%; 
    marginBottom: 1%;
`;

export const ListItemContainer = styled.View`
  width: 94%;
  margin-left: 3%;
  margin-vertical: ${moderateScale(4)}px;
`;


export const ItemHousing = styled.View`
  padding-bottom: ${moderateScale(24)}px;
`;

export const StyledTouchableHighlight = styled.TouchableHighlight`
  position: absolute;
  bottom: ${moderateScale(20)}px;
  right: ${moderateScale(20)}px;
  border-radius: ${moderateScale(25)}px;
  height: ${moderateScale(buttonSizes.large.height)}px;
  width: ${moderateScale(buttonSizes.medium.width)}px;
  z-index: 2;
  justify-content: center;
  align-items: center;
`;

export const ButtonHousing = styled.View`
  z-index: 2;
  width: ${moderateScale(buttonSizes.medium.width)}px;
  height: ${moderateScale(buttonSizes.large.height)}px;
  border-width: ${moderateScale(1)}px;
  border-color: ${colors.neutralGrey};
  border-radius: ${moderateScale(25)}px;
  padding-vertical: ${moderateScale(0)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const VerticalLine = styled.View`
  position: absolute;
  top: ${moderateScale(49)}px;
  left: ${moderateScale(24.5)}px;
  bottom: ${moderateScale(-10)}px;
  width: ${moderateScale(2)}px;
  background-color: ${colors.neutralGrey};
`;

export const StyledButtonText = styled.Text`
  width: ${moderateScale(150)}px;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.primaryBlue};
  margin-left: ${moderateScale(10)}px;
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(12)}px;
`;

export const IconWrapper = styled.View`
    border-radius: ${moderateScale(28)}px;
    border-width: ${moderateScale(1)}px;
    width: ${moderateScale(28)}px;
    height: ${moderateScale(28)}px;
    margin-right: ${moderateScale(10)}px;
`;