import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
  buttonSizes
} from '../styles';

export const ContentWrapper = styled.View`
    flex: 1;
    flex-direction: row;
    margin-left: 5%;
    width: 90%;
`;

export const LabelWrapper = styled.View`
    flex: 1;
    width: 50%;
    flex-direction: column;
`;

export const CounterWrapper = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const IconWrapper = styled.View`
    width: ${moderateScale(24)}px;
    margin-horizontal: ${moderateScale(5)}px;
`;

export const CounterText = styled.Text`
  color: ${colors.themeWhite};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Bold}px;
`;

export const TitleText = styled.Text`
  font-family: ${activeFonts.Light};
  color: ${colors.themeWhite};
  width: 77%;
  font-size: ${moderateScale(fontSizes.StandardText)};
`;

export const NavigateText = styled.Text`
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Light};
  fontSize: ${moderateScale(fontSizes.SmallText)};
`;