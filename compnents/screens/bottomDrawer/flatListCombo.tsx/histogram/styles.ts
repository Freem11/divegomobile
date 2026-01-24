import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../../../styles";

export const MainContainer = styled.View`
  width: 100%;
  align-self: flex-start;
`;

export const BarBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const HistogramLine = styled.View`
  flex-direction: column-reverse;
  margin: ${moderateScale(3)}px;
  margin-left: ${moderateScale(2)}px;
  align-items: center;
`;

export const MonthLabel = styled.Text`
  font-size: ${moderateScale(11)}px;
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Bold}
`;

export type BarContainerProps = {
  barWidth: number;
};

export const BarContainer = styled.View<BarContainerProps>`
  width: ${moderateScale(10)}px;
  height: ${(props: BarContainerProps) => props.barWidth}px;
  background-color: ${colors.primaryBlue};
  border-radius: ${moderateScale(8)}px;
`;