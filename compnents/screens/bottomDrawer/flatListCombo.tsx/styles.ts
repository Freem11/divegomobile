import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions, Platform } from "react-native";

import { activeFonts, colors, fontSizes } from "../../../styles";
const { width, height } = Dimensions.get("window");

export const VerticalFlatlistContainer = styled.View`
  flex: 1;
  padding-horizontal: 5%;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.headersBlue};
  align-self: center;
  margin-top: ${width > 700 ? height * 0.2 : height * 0.20}px;
`;

export const FilterContainer = styled.View`
  width: ${width * 0.85}px;
  padding-top: ${moderateScale(10)}px;
  padding-bottom: ${moderateScale(5)}px;
`;

export const EmptyStateWrapper = styled.View`
  padding-top:${width > 700 ? "5%" : "20%"};
`;
