import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../styles';

const windowWidth = Dimensions.get('screen').width;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  align-items: center;
`;

export const InputGroupContainer = styled.View`
  width: 90%;
  align-items: center;
  margin-bottom: ${moderateScale(40)}px;
`;

export const PhotoContainer = styled.View`
width: 98%;
align-items: center;
`;

export const Header = styled.Text`
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: center;
  text-align: center;
`;

export const LabelWrapper = styled.View`
  width: 100%;
  margin-bottom: ${moderateScale(10)}px;
  align-items: center;
`;



