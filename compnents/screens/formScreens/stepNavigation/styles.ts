import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import Button from "../../../reusables/button";
import { colors } from "../../../styles";

export const Container = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.themeWhite};
  padding: ${moderateScale(16)}px;
  padding-bottom: ${moderateScale(32)}px;
  border-top-width: 1px;
  border-top-color: ${colors.border};
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const BackButton = styled(Button)`
  flex: 1;
  height: ${moderateScale(65)}px;
  width: ${moderateScale(140)}px;
  border-radius: ${moderateScale(8)}px;
  align-self: flex-start;
`;

export const NextButton = styled(Button)`
  height: ${moderateScale(65)}px;
  border-radius: ${moderateScale(8)}px;
  width: ${moderateScale(140)}px;
  align-self: flex-end;
  flex: 1;
`;
