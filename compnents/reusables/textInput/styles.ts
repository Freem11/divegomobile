import { moderateScale } from 'react-native-size-matters';
import styled from 'styled-components/native';
import { Platform } from "react-native";

import { colors, activeFonts } from '../../styles';

export const TextInputWrapper = styled.View`
  height: ${moderateScale(44)}px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  border-color: ${colors.border};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(8)}px;
  position: relative;
`;

export const StyledTextInput = styled.TextInput`
  font-size: ${moderateScale(16)}px;
  font-family: ${activeFonts.Light};
  width: 100%;
  text-align-vertical: center;
  padding-bottom: ${Platform.OS === "android" ? moderateScale(12) : moderateScale(4)}px;
  height: ${moderateScale(44)}px;
  padding-horizontal: ${moderateScale(6)}px;
  color: ${colors.themeBlack};
`;

export const IconWrapperLeft = styled.View`
  width: ${moderateScale(20)}px;
  margin-right: ${moderateScale(4)}px;
  margin-left: ${moderateScale(10)}px;
`;

export const IconWrapperRight = styled.View`
  width: ${moderateScale(20)}px;
  margin-left: ${moderateScale(4)}px;
  margin-right: ${moderateScale(10)}px;
`;


export const IconWrapperRightClear = styled.View`
    width: ${moderateScale(20)}px;
    margin-left: ${moderateScale(-15)}px;
`;