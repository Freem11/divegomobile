import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
} from '../../styles';
import { LinearGradient } from "expo-linear-gradient";

export const Overlay = styled(LinearGradient).attrs({
  colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)'],
  locations: [0.55, 0.75, 0.9],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 40;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  border-radius: ${moderateScale(10)}px;
`;