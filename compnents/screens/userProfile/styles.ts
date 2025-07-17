import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, fontSizes, activeFonts } from "../../styles";

export const ContentContainer = styled.View`
  width: 100%;
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
