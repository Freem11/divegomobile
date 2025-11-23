import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Animated } from "react-native";

import { colors } from "../../../styles";

export const Container = styled.View`
  width: 100%;
  z-index: 20;
`;

export const ProgressBarContainer = styled.View`
  height: ${moderateScale(3)}px;
  background-color: ${colors.lighterGrey};
  border-radius: ${moderateScale(2)}px;
  overflow: hidden;
`;

export const ProgressBarFill = styled(Animated.View)`
  height: 100%;
  background-color: ${colors.primaryBlue};
  border-radius: ${moderateScale(2)}px;
`;
