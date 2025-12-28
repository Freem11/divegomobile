import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

import { activeFonts, colors, fontSizes } from "../../styles";

export const Body = styled.View`
  margin-top: ${moderateScale(50)}px;
  border-color: ${colors.border};
  border-width: ${moderateScale(2)}px;
  border-radius: ${moderateScale(12)}px;
  padding: ${moderateScale(8)}px;
`;

export const HeaderRow = styled.View`
  margin-horizontal: ${moderateScale(5)}px;
  margin-top: ${moderateScale(-20)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const MidSection = styled.View`
  width: 90%;
  gap: ${moderateScale(15)}px;
  align-self: center; 
  flex-direction: row;
  justify-content: center; 
  align-items: center; 
  flex-wrap: wrap;
  margin-top: ${moderateScale(20)}px;
  padding: ${moderateScale(5)}px;
`;

export const LowerSection = styled.View`
  flex: 1;
  padding: ${moderateScale(5)}px;
`;

export const RowLabel = styled.Text`
  line-height: ${moderateScale(18)}px;
  font-size: ${moderateScale(fontSizes.Small)}px;
  font-family: ${activeFonts.Light};
  text-align: left;
  text-wrap: pretty;
  color: ${colors.darkGrey};
  padding-top: ${moderateScale(8)}px;
`;

export const Row = styled.View`
padding-vertical: ${moderateScale(5)}px;
  gap: ${moderateScale(5)}px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;