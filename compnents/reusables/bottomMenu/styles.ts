import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../../styles';
import { Platform } from "react-native";

export const MenuContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${Platform.OS === "ios" ? moderateScale(85) : moderateScale(75)}px;
  background-color: ${colors.primaryBlue};
  z-index: 3;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: ${Platform.OS === "ios" ? moderateScale(20) : moderateScale(5)}px;
`;