import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions } from "react-native";

import { activeFonts, colors, fontSizes } from "../../styles";

const { width } = Dimensions.get("window");

export const VerticalFlatlistContainer = styled.View`
  flex: 1;
  align-items: center;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.headersBlue};
  align-self: center;
  margin-bottom: ${moderateScale(15)}px;
`;

export const EmptyStateWrapper = styled.View`
  padding-top:${width > 700 ? "5%" : "10%"};
`;

