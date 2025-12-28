import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
  activeFonts,
} from "../../styles";

const windowWidth = Dimensions.get("window").width;

export const FullScreenCenter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  
`;

export const BackButton = styled.View`
  z-index: 50;
  position: absolute;
  top: 5.5%;
  left: 2%;
`;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  align-items: center;
`;

export const InputGroupContainer = styled.View`
  margin-bottom: ${moderateScale(10)}px;
  width: ${windowWidth * 0.75}px;
`;

export const Header = styled.Text`
  margin-left: 5%;
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: flex-start;
`;

export const TextBuffer = styled.View`
  margin-top: ${moderateScale(10)}px;
  margin-bottom: ${moderateScale(20)}px;
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: ${moderateScale(10)}px;
  padding-horizontal: 7%;
`;

export const MultilineTextInput = styled.TextInput`
  padding: ${moderateScale(10)}px;
  font-size: ${moderateScale(16)}px;
  font-family: ${activeFonts.Light};
   border-width: ${moderateScale(1)}px;
  border-color: ${colors.border};
  border-radius: ${moderateScale(8)}px;
  textAlignVertical: top;
  text-align: left;
  min-height: 200px;
`;

export const BackButtonWrapper = styled.View`
  z-index: 50;
  position: absolute;
  top: 5.5%;
  left: 2%;
`;

