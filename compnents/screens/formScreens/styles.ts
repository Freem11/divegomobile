import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Dimensions, Platform } from "react-native";

import { colors, activeFonts, fontSizes } from "../../styles";
const { width, height } = Dimensions.get("window");

interface ContentContainerProps {
  insets: number;
}

export const ContentContainer = styled.View<ContentContainerProps>`
  width: 100%;
  margin-top: ${({ insets }) => `${moderateScale(insets.top) * 0.68}px`};
  align-items: center;
  flex: 1;
`;

export const InputGroupContainer = styled.View`
  width: 100%;
  padding: ${moderateScale(16)}px ${moderateScale(16)}px 0;
  flex: 1;
`;

export const CompleteContainer = styled.View`
  width: 100%;
  padding: 40% ${moderateScale(16)}px 0;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Spacer = styled.View`
  height: ${moderateScale(32)}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(fontSizes.Small)}px;
  font-family: ${activeFonts.Semibold};
  color: ${colors.themeBlack};
  margin-bottom: ${moderateScale(10)}px;
  margin-top: ${moderateScale(20)}px;
`;

export const Title = styled.Text`
  font-size: ${moderateScale(fontSizes.Medium)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.themeBlack};
  margin-bottom: ${moderateScale(8)}px;
  margin-top: ${moderateScale(20)}px;
`;

export const Subtitle = styled.Text`
  font-size: ${moderateScale(fontSizes.Base)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
  line-height: ${moderateScale(22)}px;
  width: 90%;
`;

export const MultilineTextInput = styled.TextInput`
  padding: ${moderateScale(10)}px;
  font-size: ${moderateScale(16)}px;
  font-family: ${activeFonts.Light};
  textAlignVertical: top;
  text-align: left;
  width: 100%;
  height: 100%;
`;

export const DescriptionBox = styled.View`
  align-items: center;
  justify-content: center;
  border-width: ${moderateScale(1)}px;
  border-color: ${colors.border};
  border-radius: ${moderateScale(8)}px;
  background-color: ${colors.themeWhite};
  height: ${moderateScale(200)}px;
  margin-top: ${moderateScale(20)}px;
`;

export const TripDetailsBox = styled.View`
  align-items: center;
  justify-content: center;
  border-width: ${moderateScale(1)}px;
  border-color: ${colors.border};
  border-radius: ${moderateScale(8)}px;
  background-color: ${colors.themeWhite};
  height: ${height * 0.42}px;
  margin-top: ${moderateScale(20)}px;
`;

export const EmptyStateContainer = styled.TouchableOpacity`
  width: 100%;
  background: ${colors.lighterBlue};
  height: ${moderateScale(110)}px;
  border-radius: ${moderateScale(8)}px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${moderateScale(4)}px;
`;

export const DateBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const EmptyStateWrapper = styled.View`
  padding-top:${Platform.OS === "android" || width > 700 ? "2%" : "10%"};
`;

export const DiveSiteListWrapper = styled.View`
  padding-top: 5%;
`;

export const CloneTripBox = styled.View`
  padding-top: ${moderateScale(20)};
  flex-direction: row;
  justify-content: center;
`;