import styled from "styled-components/native";
import { Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
  activeFonts,
} from "../../styles";

const windowHeight = Dimensions.get("screen").height;

export const ContentContainer = styled.View`
  flex: 1;
  background-color: ${colors.themeWhite};
  align-items: center;
  justify-content: space-evenly;
  height: ${windowHeight}px;
`;

export const HelpText = styled.Text`
margin-top: ${moderateScale(10)}px;
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.neutralGrey};
  align-self: flex-start;
  text-align: center;
`;

export const ButtonAndText = styled.View`
  align-items: center;
  justify-content: center;
`;