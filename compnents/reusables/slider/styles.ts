import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  fontSizes,
  activeFonts,
  colors,
} from "../../styles";

export const Wrapper = styled.View`
  width: 100%;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(fontSizes.Small)}px;
  font-family: ${activeFonts.Semibold};
  color: ${colors.themeBlack};
`;

export const TopRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${moderateScale(4)}px;
`;

export const SliderRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const AnimatedLabel = styled.View`
  font-size: ${moderateScale(fontSizes.Small)}px;
  height: ${moderateScale(28)}px;
  font-family: ${activeFonts.Medium};
  gap: ${moderateScale(12)}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const EndMarkerRight = styled.Text`
  width: ${moderateScale(41)}px;
  text-align: right;
  color: ${colors.neutralGrey};
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Regular};
  padding-left: ${moderateScale(5)}px;
`;

export const EndMarkerLeft = styled.Text`
  width: ${moderateScale(15)}px;
   text-align: left;
  color: ${colors.neutralGrey};
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Regular};
`;

export const LabelTag = styled.View`
  background: ${colors.lighterBlue};
  padding: ${moderateScale(5)}px ${moderateScale(8)}px ;
  border-radius: ${moderateScale(8)}px;
  border-color: ${colors.borderActive};
  border-width: ${moderateScale(1)}px;
`;
export const LabelTagText = styled.Text`
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.XSmall)}px;
`;