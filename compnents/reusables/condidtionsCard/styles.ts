import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../../styles";

export const Body = styled.View`
  margin-top: ${moderateScale(50)}px;
  border-color: ${colors.border};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(12)}px;
  padding: ${moderateScale(8)}px;
  height: 400px;
`;

export const HeaderRow = styled.View`
  margin-horizontal: ${moderateScale(5)}px;
  margin-top: ${moderateScale(-20)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
