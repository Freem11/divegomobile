import styled from 'styled-components/native';
import {StyleSheet, Animated, Dimensions, ImageBackground, Platform, SafeAreaView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Svg from "react-native-svg";
import { colors, fontSizes } from "../../../styles";

const windowHeight = Dimensions.get('screen').height;

const HALF_HEIGHT = windowHeight / 2

export const SafeArea = styled(SafeAreaView)`
  z-index: 20;
  margin-top: ${Platform.OS === 'ios' ? 0 : '10%'};
  background-color: ${colors.themeWhite};
`;

export const AnimatedSafeArea = Animated.createAnimatedComponent(SafeArea);

export const BackButtonWrapper = styled.View`
  width: 50%;
  align-items: flex-start;
`;

export const AltButtonWrapper = styled.View`
  width: 47%;
  align-items: flex-end;
`;

export const BackgroundContainer = styled(Animated.View)`
  position: absolute;
  top: 0;
  height: ${HALF_HEIGHT * 1.1}px;
  width: 100%;
  z-index: 0;
`;

export const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

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
  backgroundColor: 'rgba(255, 255, 255, 0)';
  z-index: 1;
`;

export const BottomOpaqueSection = styled(Animated.View)`
  position: absolute;
  top: ${moderateScale(75)}px;
  left: 0;
  right: 0;
  backgroundColor: ${colors.themeWhite};
  z-index: 3;
`;

export const Content = styled.View`
  z-index: 3;
  padding-vertical: 5%;
  align-items: center;
  padding-bottom: ${Platform.OS === 'ios' ? moderateScale(50) : moderateScale(80)}px;
`;

export const EmptyContainer = styled.View`
`;


export const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: 'hidden',
  },
  safeArea: {
    zIndex: 20,
    marginTop: Platform.OS === 'ios' ? 0 : '10%',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export const Header = styled.Text`
  color: ${colors.headersBlue};
  font-size: ${moderateScale(fontSizes.Header)}px;
  align-self: center;
  margin-bottom: 12px;
  margin-top: 6px;
`;
