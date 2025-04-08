import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
  buttonSizes
} from '../../styles';

export const StyledButton = styled.View`
  width: ${({size}) => moderateScale(buttonSizes[size].width)}px;
  height: ${({size}) => moderateScale(buttonSizes[size].height)}px;
  background-color: ${({alt}) => (alt ? colors.themeWhite : colors.primaryBlue)};
  border-radius: ${moderateScale(30)}px;
  border-color: ${colors.primaryBlue};
  border-width: ${moderateScale(1)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const StyledButtonText = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Regular};
  color: ${({alt}) => (alt ? colors.primaryBlue : colors.themeWhite)};
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(-10)}px;
    margin-right: ${moderateScale(5)}px;
`;

export const IconWrapperRight = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(5)}px;
    margin-right: ${moderateScale(-10)}px;
`;