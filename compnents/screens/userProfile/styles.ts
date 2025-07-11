import styled from "styled-components/native";
import { Dimensions, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
  activeFonts,
} from "../../styles";

const windowWidth = Dimensions.get("screen").width;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  align-items: center;
`;

export const InputGroupContainer = styled.View`
  margin-horizontal: 5%;
  align-items: center;
  margin-bottom: ${moderateScale(40)}px;
`;

export const PhotoContainer = styled.View`
  width: 98%;
  align-items: center;
  margin-top: ${moderateScale(20)}px;
  margin-bottom: ${moderateScale(20)}px;
`;

export const PacketHeader = styled.View`
  width: 90%;
  font-family: ${activeFonts.Light};
  flex-direction: row;
  justify-content: space-between;
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

export const Header = styled.Text`
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: center;
  text-align: center;
`;

export const Content = styled.Text`
  margin-horizontal: 3%;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
  align-self: center;
  text-align: center;
`;
export const UserNameContainer = styled.View`
  justify-content: center;
  align-items: flex-start;
`;

export const Contributor = styled.Text`
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Regular}px;
  color: ${colors.themeBlack};
`;

export const HeaderWrapper = styled.View`
 flex-direction: row;
 align-items: center;
`;

export const LabelWrapper = styled.View`
  width: 100%;
  margin-bottom: ${moderateScale(10)}px;
  align-items: center;
`;

export const IconWrapper = styled.View`
  width: ${moderateScale(24)}px;
  height: ${moderateScale(24)}px;
  margin-bottom: ${moderateScale(0)}px;
  margin-right: ${moderateScale(4)}px;
`;



