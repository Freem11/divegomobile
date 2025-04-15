import styled from 'styled-components/native';
import { Dimensions } from "react-native";
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
  buttonSizes
} from '../styles';

const windowWidth = Dimensions.get("window").width;

export const Container = styled.View`
  width: ${windowWidth};
  padding: ${moderateScale(2)}px;
  marginLeft: 0.25%;
  margin-bottom: 5%;
`;

export const ContentWrapper = styled.View`
    flex: 1;
    flex-direction: row;
    margin-left: 5%;
    width: 90%;
    pointer-events: box-none;
    margin-top: -15%;
    z-index: 2;
`;

export const TopContentWrapper = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding-top: 5%;
    width: 98%;
    height: ${moderateScale(30)}px;
    z-index: 2;
    pointer-events: box-none;
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