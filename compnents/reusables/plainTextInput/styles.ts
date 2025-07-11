import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
  activeFonts,
} from "../../styles";

export const MainContainer = styled.View`
  display: flex;
  position: relative;
  align-items: end;
  flex-direction: row;
`;

export const StyledTextInput = styled.TextInput`
  text-align: center;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Regular};
  min-width: 20%;
  max-width: 90%;
`;

export const StyledTextArea = styled.View`
    outline: none;
    padding-right: ${moderateScale(25)}px;
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    margin-right: ${moderateScale(2)}px;
`;

export const IconWrapperRight = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(2)}px;
`;
