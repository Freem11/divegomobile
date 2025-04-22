import styled from 'styled-components/native';
import { activeFonts, buttonSizes, colors, fontSizes } from "../../styles";
import { moderateScale } from 'react-native-size-matters'
import Animated from 'react-native-reanimated';

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
  bottom: ${moderateScale(25)}px;
  right: ${moderateScale(25)}px;
  border-radius: ${moderateScale(25)}px;
  height: ${moderateScale(buttonSizes.large.height)}px;
  z-index: 2;
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
  width: ${moderateScale(150)};
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.primaryBlue};
  margin-left: ${moderateScale(5)};
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(10)};
`;