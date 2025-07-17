import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, activeFonts } from "../../styles";

export const LabelWrapper = styled.View`
  width: 100%;
  margin-bottom: ${moderateScale(20)}px;
  padding: 0 ${moderateScale(20)}px;
`;

export const StatsRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${moderateScale(6)}px;
`;

export const StatsContainer = styled.View``;

export const StatRow = styled.View`
  flex-direction: row;
  margin-bottom: ${moderateScale(2)}px;
`;

export const SectionFooterWrapper = styled.View`
  width: 100%;
  margin-top: ${moderateScale(10)}px;
  padding: 0 ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const TotalCount = styled.Text`
  color: ${colors.darkGrey};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(14)}px;
`;

