import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../styles';

export const StyledLabelWrapper = styled.View`
`;

export const StyledLabelText = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Italic};
  color: ${colors.neutralGrey};
`;

