import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions, Platform } from "react-native";

import { activeFonts, colors, fontSizes } from "../styles";

const windowWidth = Dimensions.get("window").width;

export const SearchInputContainer = styled.View`
  z-index: 1;
  width: ${windowWidth*0.8}px;
  padding: ${moderateScale(10)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(120)}px;
  background-color: rgb(232, 232, 232);
`;

export const PositioningWrapper = styled.View`
  padding-top: ${Platform.OS  === "android" ? moderateScale(50) : windowWidth > 700 ? moderateScale(15) : 0};
  padding-bottom: 25;
  align-self: center;
  z-index: 20; 
`;

export const SearchResultContainer = styled.View`
  z-index: 10;
  margin-top: ${moderateScale(5)}px;
  align-self: center;
  width: 90%;
  height: ${moderateScale(60)}px;
  background-color: ${colors.buttonPressOverlay};
  border-radius: ${moderateScale(10)}px;
  text-align: center;
  justify-content: center;
  list-style: none;
`;

export const SearchCard = styled.View`
  flex-direction: row;
  align-content: center;
`;

export const CardIconContainer = styled.View`
  height: ${moderateScale(45)}px;
  justify-content: center;
  align-content: center;
`;

export const CardIcon = styled.View`
  width: ${moderateScale(30)}px;
  height: ${moderateScale(28)}px;
  margin-left: ${moderateScale(10)}px;
  margin-right: ${moderateScale(10)}px;
`;

export const LabelContainer = styled.View`
  height: ${moderateScale(45)}px;
  margin-left: ${moderateScale(10)}px;
  width: 80%;
  justify-content: center;
`;

export const SearchResultText = styled.Text`
  width: 86%;
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  text-align: left;
  color: ${colors.themeBlack};
`;

