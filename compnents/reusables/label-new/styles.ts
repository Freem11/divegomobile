import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, fontSizes, activeFonts } from "../../styles";

export const StyledLabelText = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.themeBlack};
`;

