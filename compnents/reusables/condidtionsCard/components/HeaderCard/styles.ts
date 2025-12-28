import { moderateScale } from "react-native-size-matters";
import styled from "styled-components/native";

import { activeFonts, colors } from "../../../../styles";

interface HeaderCardStyleProps {
  bgColor: string;
  size: number;
}

export const HeaderCard = styled.View<HeaderCardStyleProps>`  
  min-width: 42%;
  max-width: 52%;
  flex-direction: row;
  background-color: ${props => props.bgColor};
  height: ${moderateScale(50)}px;
  align-items: center;
  border-radius: ${moderateScale(5)}px;
  padding-horizontal: ${moderateScale(15)}px;
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
  font-size: ${moderateScale(12)}px;
  font-family: ${activeFonts.Semibold};
  text-align: left;
  text-wrap: pretty;
  color: ${colors.themeWhite}
`;

export const IconBox = styled.View`
  width: ${moderateScale(30)}px;
  padding-right: ${moderateScale(5)}px;
`;