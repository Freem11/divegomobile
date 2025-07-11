import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions } from "react-native";

import { activeFonts, colors, fontSizes } from "../../../../styles";
const { width } = Dimensions.get("window");

export const VerticalFlatlistContainer = styled.View`
  flex: 1;
  width: ${width*0.9};
  margin-left: 5%;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.headersBlue};
  align-self: center;
  margin-top: 50%;
`;