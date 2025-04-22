import styled from 'styled-components/native';
import { colors } from "../../styles";
import { moderateScale } from 'react-native-size-matters'
import Animated from 'react-native-reanimated';
import { View } from "react-native";

export const ListItemContainer = styled.View`
  width: 94%;
  margin-left: 3%;
  margin-vertical: ${moderateScale(4)}px;
`;


export const ItemHousing = styled.View`
  padding-bottom: ${moderateScale(24)}px;
`;

export const ButtonHousing = styled.View`
  z-index: 2;
  position: absolute;
  bottom: ${moderateScale(15)}px;
  right: ${moderateScale(25)}px;
  border-width: ${moderateScale(1)}px;
  border-color: ${colors.neutralGrey};
  border-radius: ${moderateScale(25)}px;
  margin-bottom: ${moderateScale(10)}px;
  padding-vertical: ${moderateScale(0)}px;
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