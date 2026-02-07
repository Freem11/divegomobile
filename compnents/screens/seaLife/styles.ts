import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Image } from "expo-image";

import {
  colors,
  fontSizes,
  activeFonts,
} from "../../styles";

const windowWidth = Dimensions.get("screen").width;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  padding: 0 ${moderateScale(20)}px;
`;

export const InfoContainer = styled.View`
  margin-bottom: ${moderateScale(16)}px;
`;

export const Header = styled.Text`
  text-align: center;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.headersBlue};
`;

export const Content = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  text-align: center;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
  line-height: ${moderateScale(22)}px;
  margin-vertical: ${moderateScale(20)}px;
  padding-bottom: ${moderateScale(10)}px;
`;

export const LabelWrapper = styled.View`
  width: 100%;
  margin-bottom: ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${moderateScale(30)}px;
`;

export const MiniLabelWrapper = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: pink;
`;

export const MiniLabel = styled.Text`
  width: 100%;
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.ThinItalic};
  text-wrap: pretty;
`;

export const HeaderWrapper = styled.View`
 flex-direction: row;
 align-items: center;
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

export const StyledImage = styled(Image)`
  width: ${moderateScale(40)}px;
  height: ${moderateScale(40)}px;
  border-radius: ${moderateScale(40)}px;
  resize-mode: cover;
`;

export const StyledIcon = styled.View`
  background-color: ${colors.lighterBlue};
  width: ${moderateScale(40)}px;
  height: ${moderateScale(40)}px;
  border-radius: ${moderateScale(40)}px;
  align-items: center;
  justify-content: center;
`;

export const UserInfo = styled.View`
  flex-direction: column;
  height: 100%;
  gap: ${moderateScale(4)}px;
  align-items: flex-start;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Semibold};
  text-wrap: pretty;
`;

export const Date = styled.Text`
  font-size: ${moderateScale(fontSizes.XSmall)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.darkGrey};
`;

export const StatRowMajor = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: ${moderateScale(2)}px;
  gap: ${moderateScale(25)}px;
  text-wrap: pretty;
`;

export const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${moderateScale(2)}px;
`;

export const MapContainer = styled.View`
  width: 100%;
  height: ${moderateScale(400)}px;
  align-self: center;
  overflow: hidden;
  border-radius: ${moderateScale(10)}px;
`;

export const MapWrapper = styled.View`
  height: ${moderateScale(400)}px;
  width: 100%;
`;

export const MapOverlay = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

export const OverlayText = styled.Text`
  color: white;
  font-family: ${activeFonts.Bold};
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  margin-top: ${moderateScale(10)}px;
  text-shadow: 0px 1px 2px rgba(0,0,0,0.5);
`;

export const CloseMapButton = styled.Pressable`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${colors.primaryBlue};
  padding: 8px 15px;
  border-radius: 20px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
`;

export const MapLockOverlay = styled.Pressable`
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: ${colors.primaryBlue};
  padding: 10px 18px;
  border-radius: 25px;
  z-index: 99; /* Ensures it sits on top of Map Pins */
  elevation: 5;
`;

export const LockText = styled.Text`
  color: white;
  font-family: ${activeFonts.Bold};
  font-size: ${moderateScale(12)}px;
`;