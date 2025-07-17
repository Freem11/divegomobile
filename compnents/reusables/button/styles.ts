import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
  activeFonts,
  buttonSizes
} from "../../styles";

export const StyledTouchableHighlight = styled.TouchableHighlight`
  width: ${({ size }) => moderateScale(buttonSizes[size].width)}px;
  height: ${({ size }) => moderateScale(buttonSizes[size].height)}px;
`;

export const StyledButton = styled.View`
  width: ${({ size }) => moderateScale(buttonSizes[size].width)}px;
  height: ${({ size }) => moderateScale(buttonSizes[size].height)}px;
  background-color: ${({ alt }) => (alt ? colors.themeWhite : colors.primaryBlue)};
  border-radius: ${({ round }) => round ? `${moderateScale(30)}px` : `${moderateScale(10)}px`};
  border-color: ${colors.primaryBlue};
  border-width: ${moderateScale(1)}px;
  padding: 0 ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const StyledButtonText = styled.Text`
  font-size: ${({ size }) => size === "thin" ? `${moderateScale(fontSizes.SmallText)}px` : `${moderateScale(fontSizes.StandardText)}px`};
  font-family: ${({ size }) => size === "thin" ? activeFonts.Medium : activeFonts.Regular};
  color: ${({ alt }) => (alt ? colors.primaryBlue : colors.themeWhite)};
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(-10)}px;
    margin-right: ${moderateScale(5)}px;
`;

export const IconWrapperRight = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(5)}px;
    margin-right: ${moderateScale(-10)}px;
`;