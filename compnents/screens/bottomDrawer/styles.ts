import styled from 'styled-components/native';
import { activeFonts, buttonSizes, colors, fontSizes } from "../../styles";
import { moderateScale } from 'react-native-size-matters'
import Animated from 'react-native-reanimated';
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;



export const Handle = styled.View`
  z-index: 11;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-color: darkgrey;
  background-color: ${colors.themeWhite};
  height: ${moderateScale(45)}px;
  width: 90%;
  border-top-right-radius: ${moderateScale(15)}px;
  border-top-left-radius: ${moderateScale(15)}px;
`;

export const HandleText = styled.Text`
  color: ${colors.themeBlack};
  font-family: ${activeFonts.Light};
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  border-top-right-radius: ${moderateScale(15)}px;
  border-top-left-radius: ${moderateScale(15)}px;
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
  bottom: ${windowWidth > 600 ? '15px' : '30px'};
  right: ${moderateScale(25)}px;
  border-radius: ${moderateScale(25)}px;
  height: ${moderateScale(buttonSizes.large.height)}px;
  z-index: 2;
  justify-content: center;
  align-items: center;
`;

export const ButtonHousing = styled.View`
  z-index: 2;
  height: ${moderateScale(buttonSizes.large.height)}px;
  border-width: ${moderateScale(1)}px;
  border-color: ${colors.neutralGrey};
  border-radius: ${moderateScale(25)}px;
  margin-bottom: ${moderateScale(10)}px;
  padding-vertical: ${moderateScale(0)}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const AnimatedButtonHousing = Animated.createAnimatedComponent(ButtonHousing);

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