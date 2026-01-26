import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  activeFonts,
  colors,
  fontSizes,
} from "../../styles";

export const Container = styled.View<{ hasError?: boolean }>`
  position: relative;
  width: 100%;
  border-color: ${props => props.hasError ? colors.red : colors.border};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(8)}px;
  background-color: white;
`;

export const Trigger = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${moderateScale(4)}px;
`;

export const IconLeft = styled.View`
  margin-horizontal: ${moderateScale(7)}px;
  width: ${moderateScale(24)}px;
  height: ${moderateScale(24)}px;
  justify-content: center;
  align-items: center;
`;

// Added this to fix the "undefined" error
export const IconRight = styled.View`
  margin-right: ${moderateScale(10)}px;
  justify-content: center;
  align-items: center;
`;

export const TriggerContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const Input = styled.TextInput`
  flex: 1;
  min-width: 100px;
  height: ${moderateScale(40)}px;
  font-family: ${activeFonts.Regular};
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  color: ${colors.themeBlack};
`;

// Renamed from Arrow to ArrowIcon and added rotation logic
export const ArrowIcon = styled.Text<{ isOpen: boolean }>`
  margin-left: ${moderateScale(6)}px;
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  color: ${colors.neutralGrey};
  transform: ${props => props.isOpen ? "rotate(180deg)" : "rotate(0deg)"};
`;

export const DropdownWrapper = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background-color: white;
  border-width: 1px;
  border-color: ${colors.border};
  border-top-width: 0;
  border-bottom-left-radius: ${moderateScale(8)}px;
  border-bottom-right-radius: ${moderateScale(8)}px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const ErrorText = styled.Text`
  color: ${colors.red};
  font-size: ${moderateScale(10)}px;
  margin-top: ${moderateScale(4)}px;
  margin-left: ${moderateScale(4)}px;
`;

export const NoDataText = styled.Text`
  padding: ${moderateScale(10)}px;
  text-align: center;
  color: ${colors.neutralGrey};
  font-family: ${activeFonts.Regular};
`;

export const LoadingText = styled.Text`
  padding: ${moderateScale(10)}px;
  text-align: center;
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Regular};
`;