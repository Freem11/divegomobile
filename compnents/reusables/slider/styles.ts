import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import Animated from "react-native-reanimated";

import {
  fontSizes,
  activeFonts,
  colors,
} from "../../styles";

export const Wrapper = styled.View`
  width: 100%;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.themeBlack};
  margin-bottom: ${moderateScale(4)}px;
`;

export const TopRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const SliderRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const AnimatedLabel = styled(Animated.Text)`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Medium};
  `;

export const EndMarkerRight = styled.Text`
  width: ${moderateScale(41)}px;
  text-align: right;
  color: ${colors.neutralGrey};
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Regular};
  padding-left: ${moderateScale(5)}px;
`;

export const EndMarkerLeft = styled.Text`
  width: ${moderateScale(15)}px;
   text-align: left;
  color: ${colors.neutralGrey};
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Regular};
`;