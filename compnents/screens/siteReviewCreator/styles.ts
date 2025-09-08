import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

import { colors, activeFonts } from "../../styles";
import Button from "../../reusables/button";

export const ContentContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const InputGroupContainer = styled.View`
  width: 100%;
  padding: 0 ${moderateScale(16)}px;
`;

export const Spacer = styled.View`
  height: ${moderateScale(32)}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.themeBlack};
  margin-bottom: ${moderateScale(10)}px;
  margin-top: ${moderateScale(20)}px;
`;


export const Title = styled.Text`
  font-size: ${moderateScale(17)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.themeBlack};
  margin-bottom: ${moderateScale(4)}px;
  margin-top: ${moderateScale(20)}px;
`;

export const Subtitle = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.neutralGrey};
  margin-bottom: ${moderateScale(18)}px;
`;

export const MultilineTextInput = styled.TextInput`
  padding: ${moderateScale(10)}px;
  font-size: ${moderateScale(16)}px;
  font-family: ${activeFonts.Light};
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
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: ${Platform.OS === "ios" ? "15%" : "2%"};
  padding-horizontal: ${moderateScale(16)}px;
`;

export const SubmitButton = styled(Button)`
  width: 100%;
  border-radius: ${moderateScale(8)}px;
  height: ${moderateScale(48)}px;
`;

export const EmptyStateContainer = styled.View`
  width: 100%;
  padding: ${moderateScale(40)}px ${moderateScale(20)}px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4%;
`;
