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
  padding-bottom: ${moderateScale(10)}px;
  margin-vertical: ${moderateScale(20)}px;
`;

export const TopRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${moderateScale(10)}px;
`;

export const SliderRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const AnimatedLabel = styled(Animated.Text)`
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Bold};
  `;

export const EndMarkerRight = styled.Text`
  width: ${moderateScale(41)}px;
  text-align: right;
  color: ${colors.neutralGrey};
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Light};
  padding-left: ${moderateScale(5)}px;
`;

export const EndMarkerLeft = styled.Text`
  width: ${moderateScale(15)}px;
   text-align: left;
  color: ${colors.neutralGrey};
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Light};
`;

export const Label = styled.Text`
  text-align: center;
  color: ${colors.headersBlue};
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.MediumItalic};
  padding-vertical: ${moderateScale(10)}px;
  margin-left: 5%;
`;