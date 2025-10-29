import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, activeFonts, buttonSizes, fontSizes } from "../../styles";

export const StyledTouchableHighlight = styled.TouchableHighlight`
  width: ${({ size }) => moderateScale(buttonSizes[size].width)}px;
  height: ${({ size }) => moderateScale(buttonSizes[size].height)}px;
  border-radius: ${({ round }) =>
    round ? `${moderateScale(30)}px` : `${moderateScale(10)}px`};
  overflow: hidden;
`;

export const StyledButton = styled.View`
  width: ${({ size }) => moderateScale(buttonSizes[size].width)}px;
  height: ${({ size }) => moderateScale(buttonSizes[size].height)}px;
  background-color: ${({ alt }) => (alt ? colors.themeWhite : colors.primaryBlue)};
  border-radius: ${({ round }) => round ? `${moderateScale(30)}px` : `${moderateScale(10)}px`};
  border-color: ${({ alt }) => (alt ? colors.primaryBlue : colors.primaryBlue)};
  border-width: ${moderateScale(2)}px;
  padding: 0 ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const DisabledButton = styled(StyledButton)`
  background-color: ${({ alt }) => (alt ? colors.themeWhite : colors.lighterGrey)};
  border-color: ${({ alt }) => (alt ? colors.lighterGrey : colors.lighterGrey)};
  color: ${({ alt }) => (alt ? colors.lighterGrey : colors.neutralGrey)};
`;

export const StyledButtonText = styled.Text`
  font-size: ${moderateScale(fontSizes.Base)}px;
  font-family: ${activeFonts.Medium};
  color: ${({ alt }) => (alt ? colors.primaryBlue : colors.themeWhite)};
  text-align: center;
  flex: 1;
`;

export const DisabledButtonText = styled(StyledButtonText)`
  color: ${({ alt }) => (alt ? colors.lighterGrey : colors.neutralGrey)};

`;

export const IconWrapperLeft = styled.View`
  position: absolute;
  left: ${moderateScale(16)}px;
  width: ${moderateScale(20)}px;
  height: ${moderateScale(20)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconWrapperRight = styled.View`
  position: absolute;
  right: ${moderateScale(16)}px;
  width: ${moderateScale(20)}px;
  height: ${moderateScale(20)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;