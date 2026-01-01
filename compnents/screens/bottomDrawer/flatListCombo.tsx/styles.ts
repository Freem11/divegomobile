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
  margin-bottom: ${moderateScale(5)}px;
`;

export const Subtitle = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  color: ${colors.lightGrey};
  font-family: ${activeFonts.Thin};
`;

export const FilterContainer = styled.View`
  width: ${width * 0.85}px;
  padding-top: ${moderateScale(10)}px;
  padding-bottom: ${moderateScale(5)}px;
`;

export const EmptyStateWrapper = styled.View`
  padding-top:${width > 700 ? "5%" : "10%"};
`;

export const SubHeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${moderateScale(40)}px;
`;

export const SubHeaderRight = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  height: ${moderateScale(40)}px;
`;

export const SubHeaderLeft = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  height: ${moderateScale(40)}px;
`;
export const SwipeIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${moderateScale(40)}px;
`;

export const IconWrapper = styled.View`
  width: ${moderateScale(40)}px;
`;