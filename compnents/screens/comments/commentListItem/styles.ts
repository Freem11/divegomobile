import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, activeFonts, fontSizes } from "../../../styles";

export const Wrapper = styled.View`
  width: 100%;
  padding-horizontal: ${moderateScale(12)}px;
  padding-top: ${moderateScale(10)}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${moderateScale(8)}px;
`;

export const Card = styled.View`
  background-color: ${colors.themeWhite};
  border-radius: ${moderateScale(12)}px;
  border-width: ${moderateScale(0.5)}px;
  border-color: ${colors.lightGrey};
  padding-top: ${moderateScale(10)}px;
  padding-bottom: ${moderateScale(12)}px;
  padding-horizontal: ${moderateScale(12)}px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
`;

export const AvatarContainer = styled.View`
  height: ${moderateScale(28)}px;
  width: ${moderateScale(28)}px;
  margin-right: ${moderateScale(15)}px;
  align-items: center;
  justify-content: center;
`;

export const HeaderTextCol = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const MainContainer = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${colors.themeWhite};
`;

export const UserTxt = styled.Text`
  font-size: ${moderateScale(fontSizes.Small)}px;
  font-family: ${activeFonts.Bold};
  line-height: ${moderateScale(18)}px;
  color: ${colors.themeBlack};
`;

export const DateTxt = styled.Text`
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Thin};
  line-height: ${moderateScale(16)}px;
  color: ${colors.darkGrey};
  margin-top: ${moderateScale(3)}px;
`;

export const ContentTxt = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light};
  line-height: ${moderateScale(20)}px;
  color: ${colors.themeBlack};
`;

export const ReadMoreTxt = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.darkGrey};
  margin-top: ${moderateScale(6)}px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  margin-top: ${moderateScale(8)}px;
  padding-left: ${moderateScale(6)}px;
  gap: ${moderateScale(16)}px;
`;

export const ActionTxt = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.darkGrey};
`;
