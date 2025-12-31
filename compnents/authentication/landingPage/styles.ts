import styled, { css } from "styled-components/native";
import { Dimensions, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../styles";

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const BackgroundContainer = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
  height: ${windowHeight * 0.5}px;
`;

export const StaticContentWrapper = styled.View`
  flex: 1;
  /* Keeps the wave at the higher position we set previously */
  margin-top: ${windowHeight * 0.34}px; 
`;

export const TopTransparentSection = styled.View`
  /* Increased height slightly to handle the 550 viewBox without squashing */
  height: ${moderateScale(85)}px; 
  width: 100%;
  z-index: 5;
  background-color: transparent;
`;

export const BottomOpaqueSection = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  padding-horizontal: ${moderateScale(20)}px;
  /* COMPENSATION: Pulls the white section up by ~15px to close the gap 
     created by the 550 viewBox height. */
  margin-top: -${moderateScale(35)}px; 
  padding-top: ${moderateScale(15)}px;
`;

export const Header = styled.Text`
  margin-top: ${moderateScale(40)}px;
  margin-right: ${windowWidth / 4}px;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.themeBlack};
`;

export const SocialText = styled.Text`
  margin-top: ${windowHeight / 25}px;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.ThinItalic};
  color: ${colors.themeBlack};
`;

export const ButtonBox = styled.View`
  padding-top: ${moderateScale(20)}px;
  width: 100%;
  align-items: center;
`;

export const ButtonSpacer = styled.View`
  padding-vertical: ${moderateScale(10)}px;
  width: 100%;
  align-items: center;
`;

export const IconRow = styled.View`
  width: ${moderateScale(220)}px;
  margin-top: ${windowHeight / 35}px;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

const sharedIconStyle = css`
  border-radius: ${moderateScale(24)}px;
  height: ${moderateScale(48)}px;
  width: ${moderateScale(48)}px;
  align-items: center;
  justify-content: center;
  ${Platform.select({
  ios: "shadow-offset: 1px 1px; shadow-opacity: 0.2; shadow-radius: 2px;",
  android: "elevation: 5;",
})}
`;

export const GoogleButton = styled.View`
  background-color: ${colors.themeBlack};
  ${sharedIconStyle}
`;

export const FacebookButton = styled.View`
  background-color: #1877f2;
  ${sharedIconStyle}
`;

export const AppleButton = styled.View`
  background-color: ${colors.themeWhite};
  ${sharedIconStyle}
  border-width: 0.5px;
  border-color: #ddd;
`;

export const GLogo = { height: moderateScale(40), width: moderateScale(40) };
export const FLogo = { marginBottom: moderateScale(4), height: moderateScale(42), width: moderateScale(42) };
export const ALogo = { height: moderateScale(48), width: moderateScale(48), resizeMode: "contain" };