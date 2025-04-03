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
  align-items: center;
  border-bottom-color: darkgray;
  border-bottom-width: 2px;
  position: relative;
`;

export const StyledTextInput = styled.TextInput`
  width: 100%;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Regular};
`;

// export const StyledIcon = styled(Icon)`
// `;
