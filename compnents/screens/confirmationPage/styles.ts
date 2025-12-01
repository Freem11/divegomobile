import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions, Platform } from "react-native";

import { colors, activeFonts, fontSizes } from "../../styles";
const { width, height } = Dimensions.get("window");

export const CompleteContainer = styled.View`
  width: 100%;
  margin-top: -40%;
  padding: 0 ${moderateScale(16)}px;
  background-color: ${colors.themeWhite};
  flex: 1;
  align-items: center;
  justify-content: center;
  z-index: -1;
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

