import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, fontSizes } from "../../../../styles";

export const MainContainer = styled.View`
  align-self: flex-start;
  margin-left: 5%;
`;

export const BarBox = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: ${moderateScale(230)}px;
`;

export const HistogramLine = styled.View`
  flex-direction: row;
  margin: ${moderateScale(3)}px;
  margin-left: ${moderateScale(2)}px;
  align-items: center;
`;

export const MonthLabel = styled.Text`
  font-size: ${moderateScale(8)}px;
  color: ${colors.themeWhite};
  margin-right: ${moderateScale(5)}px;
`;

export type BarContainerProps = {
  barWidth: number;
};

export const BarContainer = styled.View<BarContainerProps>`
  height: ${moderateScale(10)}px;
  width: ${(props) => props.barWidth}px;
  background-color: ${colors.themeWhite};
  border-radius: ${moderateScale(8)}px;
`;