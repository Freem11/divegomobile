import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import { colors, fontSizes } from "../../../../styles";

export const MainContainer = styled.View`
  align-self: left;
  margin-left: 5%;
`;

export const BarBox = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 270px;
`;

export const HistogramLine = styled.View`
  flex-direction: row;
  margin: 5px;
  margin-left: 2px;
  align-items: center;
`;

export const MonthLabel = styled.Text`
  font-size: 10px;
  color: ${colors.themeWhite};
  margin-right: 5px;
`;

export type BarContainerProps = {
  barWidth: number;
};

export const BarContainer = styled.View<BarContainerProps>`
  height: 10px;
  width: ${(props) => props.barWidth}px;
  background-color: ${colors.themeWhite};
  border-radius: 4px;
`;