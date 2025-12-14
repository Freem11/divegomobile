import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions } from "react-native";

import { colors, fontSizes, activeFonts } from "../../styles";

const windowWidth = Dimensions.get("screen").width;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  width: ${windowWidth}px;
  padding-bottom: 5%;
`;

export const InputGroupContainer = styled.View`
  margin-bottom: ${moderateScale(30)}px;
  padding: 0 ${moderateScale(20)}px;
`;

export const Header = styled.Text`
  margin-bottom: ${moderateScale(10)}px;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
  align-self: center;
  text-align: center;
`;

export const Content = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
  align-self: center;
  text-align: center;
`;

export const LabelWrapper = styled.View`
  width: 100%;
  margin-top: ${moderateScale(40)}px;
  margin-bottom: ${moderateScale(5)}px;
  padding: 0 ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ReviewsWrapper = styled.View`
  padding: 0 ${moderateScale(20)}px;
  margin-bottom: ${moderateScale(30)}px;
`;

export const ReviewsContent = styled.View`
  margin-top: ${moderateScale(10)}px;
`;

export const EmptyStateWrapper = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${moderateScale(20)}px 0;
`;

export const Stats = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.darkGrey};
  margin-bottom: ${moderateScale(20)}px;
`;
