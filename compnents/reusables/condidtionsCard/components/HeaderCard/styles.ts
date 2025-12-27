import { moderateScale } from "react-native-size-matters";
import styled from "styled-components/native";

import { activeFonts, colors, fontSizes } from "../../../../styles";

interface HeaderCardStyleProps {
  bgColor: string;
  size: number;
}

export const HeaderCard = styled.TouchableOpacity<HeaderCardStyleProps>`  
  min-width: 44%;
  flex-direction: row;
  background-color: ${props => props.bgColor};
  height: ${moderateScale(50)}px;
  align-items: flex-start;
  justify-content: center;
  border-radius: ${moderateScale(5)}px;
  margin-horizontal: ${moderateScale(15)}px;
`;

export const TextLayout = styled.TouchableOpacity<HeaderCardStyleProps>`  
  flex-direction: column;
  background-color: ${props => props.bgColor};
  height: ${moderateScale(50)}px;
  align-items: flex-start;
  justify-content: center;
  border-radius: ${moderateScale(5)}px;
`;

export const Title = styled.Text`
  line-height: ${moderateScale(18)}px;
  font-size: ${moderateScale(fontSizes.Small)}px;
  font-family: ${activeFonts.Semibold};
  text-align: left;
  text-wrap: pretty;
  color: ${colors.themeWhite}
`;

export const IconBox = styled.View`
  width: ${moderateScale(30)}px;
  margin-right: ${moderateScale(10)}px;
`;