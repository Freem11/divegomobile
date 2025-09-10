import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { colors, fontSizes, activeFonts } from "../../styles";

const windowWidth = Dimensions.get("screen").width;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
`;

export const InputGroupContainer = styled.View`
  margin: 0 ${moderateScale(20)}px ${moderateScale(30)}px;
`;

export const Header = styled.Text`
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.headersBlue};
  text-align: center;
`;

export const Content = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
  line-height: ${moderateScale(22)}px;
  margin-top: ${moderateScale(20)}px;
  text-align: center;
`;

export const Contributor = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.darkGrey};
  margin-top: ${moderateScale(20)}px;
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

export const Stats = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.darkGrey};
  margin-bottom: ${moderateScale(20)}px;
`;

export const ReviewsWrapper = styled.View`
  padding: 0 ${moderateScale(20)}px;
`;

export const ItinerariesWrapper = styled.View`
  padding: 0 ${moderateScale(20)}px;
`;

export const ButtonContainer = styled.View`
  align-items: center;
`;

export const ReviewsContent = styled.View`
`;

export const ButtonContainerReviews = styled.View`
  margin-top: ${moderateScale(-20)}px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: ${moderateScale(40)}px;
`;

export const EmptyStateWrapper = styled.View`
  padding: ${moderateScale(40)}px 0;
`;