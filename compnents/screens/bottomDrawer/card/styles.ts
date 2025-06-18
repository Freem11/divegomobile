import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import { LinearGradient } from "expo-linear-gradient";
import { activeFonts, colors, fontSizes } from "../../../styles";

export const ImageHousing = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  height: ${moderateScale(300)}px;
  width: 98%;
  align-self: center;
`;

export const Overlay = styled(LinearGradient).attrs({
  colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.65)'],
  locations: [0.55, 0.75, 0.85],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  border-radius: ${moderateScale(14)}px;
`;

export const SeaLifeName = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.themeWhite};
  align-self: left;
  margin-left: 5%;
  margin-bottom: 10%
`;