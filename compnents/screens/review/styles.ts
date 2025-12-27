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
  color: ${colors.themeBlack};
`;

export const Content = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  text-align: center;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
  line-height: ${moderateScale(22)}px;
  margin-vertical: ${moderateScale(20)}px;
`;

export const LabelWrapper = styled.View`
  width: 100%;
  margin-bottom: ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${moderateScale(2)}px;
  margin: 0 ${moderateScale(32)}px;
`;

export const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${moderateScale(2)}px;
`;