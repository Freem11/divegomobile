import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  fontSizes,
  activeFonts,
  colors,
} from "../../styles";

export const TextInputWrapper = styled.View`
  height: ${moderateScale(24)}px;
  width:  ${moderateScale(300)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  position: relative;
  padding-horizontal:  ${moderateScale(10)}px;
`;

export const StyledTextInput = styled.TextInput`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Regular};
  width: ${moderateScale(225)};
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    height: ${moderateScale(24)}px;
    margin-right: ${moderateScale(2)}px;
`;

export const IconWrapperRight = styled.View`
    width: ${moderateScale(24)}px;
    height: ${moderateScale(24)}px;
    margin-left: ${moderateScale(2)}px;
`;
