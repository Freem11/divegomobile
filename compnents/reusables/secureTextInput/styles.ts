import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../styles';
import { Platform } from "react-native";

export const TextInputWrapper = styled.View`
  height: ${moderateScale(35)}px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  border-bottom-color: ${colors.neutralGrey};
  border-bottom-width: ${moderateScale(2)}px;
  position: relative;
`;

export const StyledTextInput = styled.TextInput`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.themeBlack};
  padding-bottom: ${Platform.OS === "android" ? moderateScale(12) : moderateScale(7)}px;
  height: ${moderateScale(40)}px;
  width: 82%;
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    margin-right: ${moderateScale(2)}px;
`;

export const IconWrapperRight = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(2)}px;
`;
