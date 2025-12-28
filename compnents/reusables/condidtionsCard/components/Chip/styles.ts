import { moderateScale } from "react-native-size-matters";
import styled from "styled-components/native";

import { activeFonts, colors, fontSizes } from "../../../../styles";

interface HeaderCardStyleProps {
  bgColor: string;
  size: number;
}

export const HeaderCard = styled.View<HeaderCardStyleProps>`
  flex-direction: row;
  background-color: ${props => props.bgColor};
  height: ${moderateScale(30)}px;
  align-items: center;
  align-self: flex-start;
  border-radius: ${moderateScale(25)}px;
  padding-horizontal: ${moderateScale(15)}px;
  padding-vertical: ${moderateScale(5)}px;
`;

export const TextLayout = styled.View<HeaderCardStyleProps>`
  flex-direction: column;
  height: ${moderateScale(50)}px;
  align-items: flex-start;
  justify-content: center;
  border-radius: ${moderateScale(5)}px;
`;

export const Title = styled.Text`
  line-height: ${moderateScale(18)}px;
  font-size: ${moderateScale(fontSizes.Small)}px;
  font-family: ${activeFonts.Medium};
  text-align: left;
  text-wrap: pretty;
  color: ${colors.themeWhite}
`;

export const IconBox = styled.View`
  aling-self: center;
  width: ${moderateScale(30)}px;
  padding-right: ${moderateScale(5)}px;
`;