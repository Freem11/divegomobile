import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../../styles";

const { width, height } = Dimensions.get("window");

export const AddDiveSitesButton = styled.TouchableOpacity`
  flex-direction: row;
  overflow: hidden;
  background: ${colors.lighterBlue};
  align-items: center;
  border-radius: ${moderateScale(10)}px;
  width: ${width - moderateScale(32)};
  height: ${moderateScale(70)};
  padding-left: ${moderateScale(15)}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.borderActive};
  padding-left: ${moderateScale(15)}px;
`;