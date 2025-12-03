import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  activeFonts,
  colors,
  fontSizes,
} from "../../styles";

export const Container = styled.View`
  position: relative; /* ⬅️ CRITICAL CHANGE */
  width: 100%;
  border-color: ${props => props.hasError ? colors.red : colors.border};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(8)}px;
`;

export const Trigger = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-top:  ${moderateScale(4)}px;
`;

export const IconLeft = styled.View`
  margin-right: ${moderateScale(6)}px;
  width: ${moderateScale(24)}px;
  height:${moderateScale(24)}px;
`;

export const TriggerContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const Input = styled.TextInput`
  flex: 1;
  min-width: 100px;
  height: ${moderateScale(40)}px;
  font-family: ${activeFonts.Regular};
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  color: ${colors.themeBlack};
`;

export const Arrow = styled.Text`
  margin-left: ${moderateScale(6)}px;
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const DropdownWrapper = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  background-color: white;
  border-width: 1px;
  border-color: #ccc;
  border-top-width: 0;
`;
