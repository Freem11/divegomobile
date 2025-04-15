import styled from 'styled-components/native';
import { Dimensions } from "react-native";
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts
} from '../styles';
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;

export const Container = styled.View`
  width: ${windowWidth};
  margin-left: 0.75%;
  margin-vertical: 2%;
`;

export const Overlay = styled(LinearGradient).attrs({
  colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)'],
  locations: [0.55, 0.75, 0.9],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
})`
  position: absolute;
  z-index: 1;
  width: 98.5%;
  height: 100%;
  align-items: center;
  border-radius: ${moderateScale(10)}px;
  pointer-events: box-none;
`;

export const ContentWrapper = styled.View`
  flex-direction: row;
  margin-left: 3%;
  width: 93%;
  pointer-events: box-none;
  z-index: 2;
  position: absolute;
  bottom: ${moderateScale(18)}px;
`;

export const TopContentWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 98%;
  height: ${moderateScale(20)}px;
  z-index: 2;
  pointer-events: box-none;
  position: absolute;
  top: ${moderateScale(10)}px;
`;

export const LabelWrapper = styled.View`
  flex-direction: column;
  pointer-events: box-none;
  width: 75%;
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
  font-size: ${moderateScale(fontSizes.StandardText)}px;
`;

export const NavigateTextPressable = styled.Pressable`
  align-self: flex-start;
`;

export const NavigateText = styled.Text`
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Light};
  fontSize: ${moderateScale(fontSizes.SmallText)};
  pointer-events: box-none;
`;