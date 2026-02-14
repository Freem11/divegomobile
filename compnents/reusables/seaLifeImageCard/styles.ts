import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";

import {
  colors,
  fontSizes,
  activeFonts
} from "../../styles";

export const Container = styled.View`
  margin-vertical: 2%;
  position: relative;
`;

export const Overlay = styled(LinearGradient).attrs({
  colors: ["rgba(0,0,0,0)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.75)"],
  locations: [0.55, 0.75, 0.9],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  border-radius: ${moderateScale(10)}px;
`;

export const ContentWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  z-index: 3;
  width: 100%;
  padding-horizontal: ${moderateScale(15)}px;
  position: absolute;
  bottom: ${moderateScale(15)}px;
`;

export const TopContentWrapper = styled.View`
  height: ${moderateScale(20)}px;
  z-index: 3;
  position: absolute;
  flex-direction: row;
  gap: ${moderateScale(15)}px;
  top: ${moderateScale(15)}px;
  right: ${moderateScale(15)}px;
  border-radius: ${moderateScale(20)}px;
`;

export const LabelWrapper = styled.View`
  flex-direction: column;
  gap: ${moderateScale(3)}px;
  flex-shrink: 1;
`;

export const IconsWrapper = styled.View`
  flex-direction: row;
  gap: ${moderateScale(10)}px;
  position: relative;
  bottom: -${moderateScale(5)}px;
  flex-shrink: 0;
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
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const PlaceholderText = styled.Text`
color: ${colors.primaryBlue};
font-family: ${activeFonts.Light};
font-size: ${moderateScale(fontSizes.SmallText)}px;
`;