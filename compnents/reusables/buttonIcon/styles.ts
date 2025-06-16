import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
  buttonSizes
} from '../../styles';

export const StyledTouchableHighlight = styled.TouchableHighlight`
    height: ${({size}) => moderateScale(buttonSizes[size].height)}px;
    border-radius: ${({size}) => moderateScale(buttonSizes[size].height)/2}px;
`;

export const StyledButton = styled.View`
  height: ${({size}) => moderateScale(buttonSizes[size].height)}px;
  background-color: 'transparent';
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledButtonText = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.themeWhite};
  margin-top: ${moderateScale(5)}px;
`;

export const IconWrapper = styled.View`
    width: ${moderateScale(50)}px;
`;

