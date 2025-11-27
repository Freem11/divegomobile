import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../../styles";

const { width, height } = Dimensions.get("window");

export const CloneTripButton = styled.TouchableOpacity`
  flex-direction: row;
  overflow: hidden;
  background: ${colors.lighterBlue};
  align-items: center;
  border-radius: ${moderateScale(10)}px;
  height: ${moderateScale(60)};
  padding-left: ${moderateScale(25)}px;
  padding-right: ${moderateScale(28)}px;
  padding-top: ${moderateScale(2)}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.borderActive};
  padding-left: ${moderateScale(15)}px;
`;

export const PopOver = styled.View`
  padding-horizontal: ${moderateScale(15)}px;
  padding-vertical: ${moderateScale(20)}px;
`;

export const PopOverText = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  text-align: center;
  color: ${colors.themeBlack};
`;