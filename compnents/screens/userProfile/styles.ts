import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions } from "react-native";

import { colors, fontSizes, activeFonts } from "../../styles";

const windowWidth = Dimensions.get("screen").width;

export const ContentContainer = styled.View`
   width: ${windowWidth}px;
`;

export const InputGroupContainer = styled.View`
  margin-bottom: ${moderateScale(30)}px;
  padding: 0 ${moderateScale(20)}px;
`;

export const Header = styled.Text`
  margin-bottom: ${moderateScale(10)}px;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: center;
  text-align: center;
`;

export const Content = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
  align-self: center;
  text-align: center;
`;
