import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { colors, fontSizes, activeFonts } from "../../styles";

const windowWidth = Dimensions.get("screen").width;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  align-items: center;
`;

export const InputGroupContainer = styled.View`
  margin: 0 ${moderateScale(20)}px ${moderateScale(30)}px;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.themeBlack};
`;

export const Content = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
  line-height: ${moderateScale(22)}px;
  margin-top: ${moderateScale(20)}px;
`;

export const Contributor = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.darkGrey};
  margin-top: ${moderateScale(20)}px;
`;

export const LabelWrapper = styled.View`
  width: 100%;
  margin-bottom: ${moderateScale(20)}px;
  padding: 0 ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonWrapper= styled.View`
  width: 100%;
  justify-content: space-evenly;
  flex-direction: row;
  margin-vertical: 5%;
`;

export const SectionCount = styled.Text`
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const SectionFooterWrapper = styled.View`
  width: 100%;
  margin-top: ${moderateScale(10)}px;
  padding: 0 ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StatWrapper = styled.View`
  width: 100%;
  margin-left: 5%;
  margin-vertical: ${moderateScale(3)}px;
`;

export const TotalCount = styled.Text`
  color: ${colors.darkGrey};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const ViewMoreButtonText = styled.Text`
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const ViewMoreButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: -${moderateScale(5)}px;
`;

export const Stats = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Thin}px;
  color: ${colors.themeBlack};
`;
