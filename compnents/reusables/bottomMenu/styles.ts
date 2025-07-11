import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

import { colors } from "../../styles";

export const MenuContainer = styled.View`
  position: relative;
  flex: 1;
  bottom: 0;
  width: 100%;
  margin-top: -1px;
  padding-top: ${moderateScale(10)}px;
  height: ${Platform.OS === "ios" ? moderateScale(75) : moderateScale(75)}px;
  background-color: ${colors.primaryBlue};
  z-index: 3;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding-bottom: ${Platform.OS === "ios" ? moderateScale(20) : moderateScale(5)}px;
`;