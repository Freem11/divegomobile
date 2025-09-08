import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

import { colors, fontSizes, activeFonts } from "../../styles";

export const EmptyStateWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 ${moderateScale(20)}px;
`;

export const Subtitle = styled.Text`
  font-size: ${Platform.OS === "ios" ? (moderateScale(fontSizes.StandardText)) : (moderateScale(fontSizes.SmallText))}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.darkGrey};
  margin-top: ${moderateScale(5)}px;
  text-align: center;
`;

export const IconWrapper = styled.View`
  height: ${moderateScale(50)}px;
  width: ${moderateScale(50)}px;
`;
export const IconContainer = styled.View`
  background: ${colors.border};
  height: ${moderateScale(100)}px;
  width: ${moderateScale(100)}px;
  border-radius: ${moderateScale(130)}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${moderateScale(20)}px;
`;

