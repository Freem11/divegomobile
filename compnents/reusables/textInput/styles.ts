import { moderateScale } from 'react-native-size-matters';
import styled from 'styled-components/native';
import { Platform } from "react-native";

import { colors, activeFonts, fontSizes } from '../../styles';

export const Container = styled.View`
  width: 100%;
`;

export const TextInputWrapper = styled.View<{ hasError?: boolean }>`
  height: ${moderateScale(44)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-color: ${props => props.hasError ? colors.red : colors.border};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(8)}px;
  position: relative;
`;

export const StyledTextInput = styled.TextInput`
  font-size: ${moderateScale(fontSizes.Base)}px;
  font-family: ${activeFonts.Light};
  flex: 1;
  text-align-vertical: center;
  padding-bottom: ${Platform.OS === "android" ? moderateScale(12) : 0}px;
  height: ${moderateScale(44)}px;
  padding-horizontal: ${moderateScale(6)}px;
  color: ${colors.themeBlack};
`;

export const IconWrapperLeft = styled.View`
  width: ${moderateScale(16)}px;
  margin-right: ${moderateScale(4)}px;
  margin-left: ${moderateScale(10)}px;
  justify-content: center;
  align-items: center;
`;

export const IconWrapperRight = styled.View`
  width: ${moderateScale(20)}px;
  margin-left: ${moderateScale(4)}px;
  margin-right: ${moderateScale(10)}px;
  justify-content: center;
  align-items: center;
`;


export const IconWrapperRightClear = styled.View`
    width: ${moderateScale(20)}px;
    margin-left: ${moderateScale(-15)}px;
    justify-content: center;
    align-items: center;
`;

export const ErrorText = styled.Text`
  font-size: ${moderateScale(fontSizes.Small)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.red};
  margin-top: ${moderateScale(4)}px;
  margin-left: ${moderateScale(2)}px;
`;