import styled from "styled-components/native";
import {StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";
import Svg from "react-native-svg";

import { colors } from "../../styles";

const windowHeight = Dimensions.get("screen").height;

const HALF_HEIGHT = windowHeight / 2;

export const HeaderWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 ${moderateScale(20)}px;
`;

export const BackgroundContainer = styled(Animated.View)`
  position: absolute;
  top: 0;
  height: ${HALF_HEIGHT * 1.1}px;
  width: 100%;
  z-index: 0;
`;

export const StyledSvg = styled(Svg)`
  position: absolute;
  top: ${({ topOffset }) => `${topOffset}px`};
  z-index: 5;
  background-color: transparent;
`;

export const TopTransparentSection = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${moderateScale(100)}px;
  z-index: 1;
`;

export const BottomOpaqueSection = styled(Animated.View)`
  position: absolute;
  top: ${moderateScale(75)}px;
  left: 0;
  right: 0;
  background-color: ${colors.themeWhite};
  z-index: 3;
`;

export const Content = styled.View`
  z-index: 3;
  align-items: center;
  padding: 5% 0 ${Platform.OS === "ios" ? moderateScale(50) : moderateScale(80)}px;
`;

export const EmptyContainer = styled.View``;

export const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: "hidden",
  },
  safeArea: {
    zIndex: 20,
    marginTop: Platform.OS === "ios" ? 0 : "15%",
    flexDirection: "row",
    alignItems: "center"
  }
});
