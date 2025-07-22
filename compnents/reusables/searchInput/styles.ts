import styled from 'styled-components/native';
import { moderateScale, scale } from 'react-native-size-matters';
import {
  fontSizes,
  activeFonts,
  colors,
} from '../../styles';
import { Platform } from "react-native";

export const TextInputWrapper = styled.View`
  height: ${moderateScale(24)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  position: relative;
  padding-horizontal:  ${moderateScale(10)}px;
`;

export const StyledTextInput = styled.TextInput`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Regular};
  width: ${scale(210)}px;
  padding-bottom: ${Platform.OS === "android" ? moderateScale(5) : moderateScale(0)}px;
  height: ${moderateScale(32)}px;
  text-align-vertical: center;
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    height: ${moderateScale(24)}px;
    margin-right: 3%;
`;

export const IconWrapperRight = styled.View`
    width: ${moderateScale(24)}px;
    height: ${moderateScale(24)}px;
`;
