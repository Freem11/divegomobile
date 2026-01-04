import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  activeFonts,
  colors,
  fontSizes,
} from "../../styles";

export const ErrorText = styled.Text`
  font-size: ${moderateScale(fontSizes.Small)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.red};
  margin-top: ${moderateScale(4)}px;
  margin-left: ${moderateScale(2)}px;
`;