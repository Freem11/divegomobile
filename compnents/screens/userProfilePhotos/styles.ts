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
  align-items: left;
  height: ${windowHeight}px;
`;

export const SafeArea = styled(SafeAreaView)`
  z-index: 20;
  margin-top: ${Platform.OS === "ios" ? 0 : "10%"};
  background-color: ${colors.themeWhite};
`;

export const BackButtonWrapper = styled.View`
  width: 50%;
  align-items: flex-start;
`;

export const PhotoContainer = styled.View`
  width: 98%;
  align-items: center;
  margin-left: 3%;
  margin-top: ${moderateScale(20)}px;
  margin-bottom: ${moderateScale(20)}px;
`;

export const HeaderWrapper = styled.View`
 flex-direction: row;
 align-items: center;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: center;
  text-align: center;
`;

export const PacketHeader = styled.View`
  width: 100%;
  font-family: ${activeFonts.Light};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

export const PacketHeaderItem = styled.Text`
  margin: 0 2% 1% 0;
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.primaryBlue};
  align-self: flex-start;
  text-align: center;
`;

export const IconWrapper = styled.View`
    width: ${moderateScale(24)}px;
    height: ${moderateScale(24)}px;
      margin-right: ${moderateScale(4)}px;
`;