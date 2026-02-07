import styled from "styled-components/native";
import { Dimensions, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../../styles";

const { width, height } = Dimensions.get("window");

export const RankingCard = styled.TouchableOpacity`
  flex-direction: row;
  overflow: hidden;
  background: ${colors.themeWhite};
  align-items: center;
  border-radius: ${moderateScale(10)}px;
  width: ${width - moderateScale(32)};
  height: ${moderateScale(70)};
  padding-left: ${moderateScale(15)}px;
  margin-bottom: ${moderateScale(8)}px;
  border-color: ${colors.border};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(12)}px;
  ${Platform.select({
  ios: `
      shadow-color: #000;
      shadow-offset: 0px 0px;
      shadow-opacity: 0.04;
      shadow-radius: 4px;
    `,
  android: `
      elevation: 0;
    `,
})}
`;

export const CardSeparator = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: ${moderateScale(20)}px
`;

export const Label = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.themeBlack};
  padding-left: ${moderateScale(15)}px;
`;