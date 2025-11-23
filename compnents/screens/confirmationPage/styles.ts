import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions, Platform } from "react-native";

import { colors, activeFonts, fontSizes } from "../../styles";
const { width, height } = Dimensions.get("window");

export const CompleteContainer = styled.View`
  width: 100%;
  padding: 40% ${moderateScale(16)}px 0;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: ${moderateScale(fontSizes.Medium)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.themeBlack};
  margin-bottom: ${moderateScale(8)}px;
  margin-top: ${moderateScale(20)}px;
`;

export const Subtitle = styled.Text`
  font-size: ${moderateScale(fontSizes.Base)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
  line-height: ${moderateScale(22)}px;
  width: 90%;
`;

