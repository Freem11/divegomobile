import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
  activeFonts,
} from "../../styles";

export const EmptyStateWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledLabelText = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.neutralGrey};
`;

export const IconSetWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const IconSetWrapperLeft = styled.View`
  margin-top: ${moderateScale(-20)}px;
  margin-right: ${moderateScale(-50)}px;
  padding-left: ${moderateScale(10)}px;
`;

export const IconSetWrapperCenter = styled.View`
  z-index:2;
  margin-top: ${moderateScale(5)}px;
`;

export const IconSetWrapperRight = styled.View`
  margin-top: ${moderateScale(-20)}px;
  margin-left: ${moderateScale(-50)}px;
`;