import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";

import { activeFonts, buttonSizes, colors, fontSizes } from "../styles";
export const Container = styled.View`
    flex: 1; 
    align-items: center;
    justify-content: center;
    background-color: green;
`;

export const SafeAreaTop = styled(SafeAreaView)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 90;
`;

export const SafeAreaBottom = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
`;

export const BottomMenu = styled.View`
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 3;
    pointer-events: box-none;
`;

export const StyledTouchableHighlight = styled.TouchableHighlight`
  width: ${({ size }) => moderateScale(buttonSizes[size].width)}px;
  height: ${({ size }) => moderateScale(buttonSizes[size].height)}px;
  border-radius: ${moderateScale(30)}px;
`;

export const StyledButton = styled.View`
  width: ${({ size }) => moderateScale(buttonSizes[size].width)}px;
  height: ${({ size }) => moderateScale(buttonSizes[size].height)}px;
  background-color: ${({ alt }) => (alt ? colors.themeWhite : colors.primaryBlue)};
  border-radius: ${moderateScale(30)}px;
  border-color: ${colors.primaryBlue};
  border-width: ${moderateScale(1)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const StyledButtonText = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Regular};
  color: ${({ alt }) => (alt ? colors.primaryBlue : colors.themeWhite)};
`;

export const IconWrapperLeft = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(-10)}px;
    margin-right: ${moderateScale(5)}px;
`;

export const IconWrapperRight = styled.View`
    width: ${moderateScale(24)}px;
    margin-left: ${moderateScale(5)}px;
    margin-right: ${moderateScale(-10)}px;
`;

export const TargetWrapper = styled.View`
    flex: 1; 
    align-self: flex-end;
    align-items: flex-end;
    margin-right: ${moderateScale(10)}px;
    margin-bottom: ${moderateScale(10)}px;
    z-index: 1;
    pointer-events: box-none;
`;

export const TargetWrapperAlt = styled.View`
    flex: 1; 
    align-self: flex-end;
    align-items: flex-end;
    margin-right: ${moderateScale(-50)}px;
    margin-bottom: ${moderateScale(20)}px;
    z-index: 1;
    pointer-events: box-none;
`;

export const PopOverWrapper = styled.View`
    flex: 1; 
    align-self: flex-start;
    align-items: bottom;
    margin-left: ${moderateScale(7)}px;
    margin-bottom: ${moderateScale(-42)}px;
    z-index: 1;
    pointer-events: box-none;
`;

export const PopOver = styled.View`
  padding: ${moderateScale(15)}px;
  align-items: center; 
  justify-content: center;
`;

export const PopOverText = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  text-align: center;
  color: ${colors.themeBlack};
  margin-top: ${moderateScale(4)}px;
  margin-bottom: ${moderateScale(12)}px;
`;