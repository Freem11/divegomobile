import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  fontSizes,
  activeFonts
} from '../../styles';


export const StyledTouchableHighlight = styled.TouchableHighlight`
  padding: ${moderateScale(5)}px;
  padding-right: ${moderateScale(5)}px;
`;

export const StyledHousing = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-end;
  margin: ${moderateScale(5)}px;;
`;

export const StyledLabelText = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  padding-left: ${moderateScale(5)}px;
`;

export const IconWrapper = styled.View`
    width: ${moderateScale(24)}px;
    height: ${moderateScale(24)}px;
`;