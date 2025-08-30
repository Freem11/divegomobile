import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import Animated from "react-native-reanimated";

import {
  fontSizes,
  activeFonts,
} from "../../styles";

export const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-left: 5%;
  padding-bottom: ${moderateScale(10)};
`;

export const SliderWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const AnimatedLabel = styled(Animated.Text)`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Bold};
  margin-bottom: ${moderateScale(10)}
  `;

export const EndMarker = styled.Text`
  width: ${moderateScale(45)}px;
  text-align: center;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light};
`;
