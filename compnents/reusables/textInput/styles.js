import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
  authenicationButton, 
  buttonText,
  screenSecondaryButton,
  buttonTextAlt,
} from '../../styles';

export const TextInputWrapper = styled.View`
  height: ${moderateScale(30)}px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  border-bottom-color: darkgray;
  border-bottom-width: 2px;
  position: relative;
`;

export const StyledTextInput = styled.TextInput`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Regular};
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    margin-right: ${moderateScale(2)}px;
`;

export const IconWrapperRight = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(2)}px;
`;
