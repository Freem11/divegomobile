import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../../styles";

const { width, height } = Dimensions.get("window");

export const FeatureButton = styled.TouchableOpacity`
  flex-direction: row;
  overflow: hidden;
  background: ${colors.lighterBlue};
  align-items: center;
  border-radius: ${moderateScale(5)}px;
  padding-vertical: ${moderateScale(10)}px;
  padding-left: ${moderateScale(10)}px;
  padding-right: ${moderateScale(15)}px;
  width: ${width / 2.5}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(fontSizes.Medium)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.borderActive};
  width: 75%;
  text-align: center;
`;