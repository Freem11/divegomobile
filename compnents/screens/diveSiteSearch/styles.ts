import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions } from "react-native";

import { activeFonts, colors, fontSizes } from "../../styles";

const { width } = Dimensions.get("window");

export const VerticalFlatlistContainer = styled.View`
  flex: 1;
  align-items: center;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${moderateScale(20)}px;
  width: 100%;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.headersBlue};
  align-self: center;
`;

export const EmptyStateWrapper = styled.View`
  flex: 1;
  width: ${width}px;
  justify-content: center;
  align-items: center;
`;
