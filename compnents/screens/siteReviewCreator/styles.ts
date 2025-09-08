import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

import { colors, fontSizes, activeFonts } from "../../styles";
import ToggleButton from "../../reusables/togglebutton";

export const ContentContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const InputGroupContainer = styled.View`
  width: 100%;
  padding: ${moderateScale(24)}px ${moderateScale(16)}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.themeBlack};
  margin-bottom: ${moderateScale(10)}px;
`;

export const Section = styled.View`
  margin-bottom: ${moderateScale(20)}px;
`;

export const TextBuffer = styled.View`
  margin-top: ${moderateScale(20)}px;
  margin-bottom: ${moderateScale(10)}px;
  margin-left: 1%;
  width: 98%;
`;

export const MultilineTextInput = styled.TextInput`
  padding: ${moderateScale(10)}px;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Light};
  text-align: center;
  height: 99%;
`;

export const DescriptionBox = styled.View`
  align-items: center;
  justify-content: center;
  borderWidth: ${moderateScale(1)}px;
  borderColor: ${colors.neutralGrey};
  borderRadius: ${moderateScale(10)}px;
  margin-top: 4%;
  background-color: ${colors.themeWhite};
  margin-bottom: ${moderateScale(50)}px;
  height: ${moderateScale(300)}px;
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: ${Platform.OS === "ios" ? "15%" : "2%"};
  padding-horizontal: 7%;
`;

export const EmptyStateContainer = styled.View`
  width: 100%;
  padding: ${moderateScale(40)}px ${moderateScale(20)}px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4%;
`;

export const PhotosContainer = styled.View`
  margin-top: 4%;
  `;

export const StyledButton = styled(ToggleButton)`
  flex: 1;
  padding-horizontal: ${moderateScale(2)}px;
  justify-content: flex-start;
  width: auto;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  width: 100%;
  padding: ${moderateScale(2)}px
`;

export const TypeOfDiveButtons = styled.View`
  flex: 1;
  padding-vertical: ${moderateScale(10)}px;
  padding-bottom: ${moderateScale(30)}px;
  width: 100%;
`;

export const WaterTypeButtons = styled.View`
  flex: 1;
  padding-vertical: ${moderateScale(10)}px;
  padding-bottom: ${moderateScale(30)}px;
  width: 100%;
`;

export const AttheSurfaceButtons = styled.View`
  flex: 1;
  padding-vertical: ${moderateScale(10)}px;
  padding-bottom: ${moderateScale(30)}px;
  width: 100%;
`;

export const CurrentButtons = styled.View`
  flex: 1;
  padding-vertical: ${moderateScale(10)}px;
  padding-bottom: ${moderateScale(30)}px;
  width: 100%;
`;

export const InTheWaterButtons = styled.View`
  flex: 1;
  padding-vertical: ${moderateScale(10)}px;
  padding-bottom: ${moderateScale(30)}px;
  width: 100%;
`;

