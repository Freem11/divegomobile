import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, fontSizes, activeFonts } from "../../styles";

export const ContentContainer = styled.View`
  width: 100%;
  padding: 0 ${moderateScale(20)}px;
`;

export const InputGroupContainer = styled.View`
  margin-bottom: ${moderateScale(30)}px;
`;

export const PhotoContainer = styled.View`
  width: 100%;
  margin-top: ${moderateScale(20)}px;
  margin-bottom: ${moderateScale(20)}px;
`;

export const PacketHeader = styled.View`
  font-family: ${activeFonts.Light};
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

export const PacketHeaderItem = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.primaryBlue};
  align-self: flex-start;
  text-align: center;
`;

export const PacketHeaderDate = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.neutralGrey};
  align-self: flex-start;
  text-align: center;
  margin-left: ${moderateScale(22)}px;
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
  width: ${moderateScale(18)}px;
  height: ${moderateScale(18)}px;
  margin-bottom: ${moderateScale(0)}px;
  margin-right: ${moderateScale(4)}px;
`;



