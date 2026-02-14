import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
  activeFonts,
  buttonSizes
} from "../../styles";

export const StyledTouchableHighlight = styled.TouchableHighlight`
  border-radius: ${moderateScale(5)}px;
  padding-horizontal: ${moderateScale(5)}px;
`;

export const StyledButton = styled.View`
  height: ${({ size }) => moderateScale(buttonSizes[size].height)}px;
  background-color: 'transparent';
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${moderateScale(3)}px;
`;

export const IconWrapper = styled.View`
  width: ${moderateScale(16)}px;
`;

export const CounterText = styled.Text`
  color: ${colors.themeWhite};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Bold};
`;

