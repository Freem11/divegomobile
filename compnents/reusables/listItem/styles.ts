import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

import {
  colors,
  fontSizes,
  activeFonts,
  buttonSizes
} from "../../styles";
import { windowWidth } from "../../authentication/styles";

export const Card = styled.View`
  border-color: #dadada;
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(10)}px;
  width: 96%;
  margin-left: 2%;
  margin-vertical: ${moderateScale(5)}px;
  padding: ${moderateScale(10)}px;
    ${Platform.select({
  ios: `
      shadow-color: #000;
      shadow-offset: 0px 1px;
      shadow-opacity: 0.1;
      shadow-radius: 2px;
    `,
  android: `
      elevation: 3;
    `,
})}
`;

export const CardTop = styled.View`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${moderateScale(5)}px;
  flex-direction: row;
  width: 100%;
`;

export const MainContent = styled.View`
  flex-direction: column;
`;

export const Title = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  fon-family: ${activeFonts.Bold};
`;

export const Info = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${moderateScale(5)}px;
`;

export const TopText = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Thin};
`;

export const Actions = styled.View`
  flex-direction: ${windowWidth > 600 ? "row" : "column"};
  justify-content: space-between;
  align-items: center;
`;

export const Description = styled.View`
   flex-direction: column;
   width: 99%;
`;

export const DescriptionTextCollapsed = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Regular};
  flex-wrap: wrap;
  width: 90%;
  margin-top: ${moderateScale(10)}px;
`;

export const DescriptionTextExpanded = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Regular};
  flex-wrap: wrap;
  width: 90%;
  margin-top: ${moderateScale(10)}px;
`;

export const ShowMoreText = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  fon-family: ${activeFonts.Regular};
  text-decoration-line: underline;
  margin-top: ${moderateScale(10)}px;
`;
