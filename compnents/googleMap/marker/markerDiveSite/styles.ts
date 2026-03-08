import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../../styles";

export const SiteNumber = styled.View`
  background-color: ${colors.primaryBlue};
  align-items: center;
  justify-content: center; 
`;

export const SiteLabel = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.themeWhite};
`;