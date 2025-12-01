import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../styles';

const windowWidth = Dimensions.get('screen').width;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  padding: 0 ${moderateScale(20)}px;
`;

export const InfoContainer = styled.View`
  margin-bottom: ${moderateScale(30)}px;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.headersBlue};
`;

export const Content = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
  line-height: ${moderateScale(22)}px;
  margin-top: ${moderateScale(20)}px;
`;

export const LabelWrapper = styled.View`
  width: 100%;
  margin-bottom: ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SectionCount = styled.Text`
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const EmptyStateWrapper = styled.View`
  padding: ${moderateScale(40)}px 0;
`;
