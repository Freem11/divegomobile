import React from "react";
import { StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import Animated from "react-native-reanimated";
import ButtonIcon from "../buttonIcon";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { colors } from "../../styles";
import * as S from "./styles";
import { WavyImg } from "./wavyImg";
import { useParallaxDrawer } from "./useParallelDrawer";

type ParallaxDrawerProps = {
  headerImage: any;
  children: React.ReactElement<{ closeParallax: (mapConfig: number | null) => void }>;
  onClose: () => void;
  onMapFlip?: () => void;
};

const ParallaxDrawer = ({
  headerImage,
  children,
  onClose,
  onMapFlip
}: ParallaxDrawerProps) => {
  
  const {
    SCREEN_WIDTH,
    panGesture,
    animatedDrawerStyle,
    animatedBackgroundStyle,
    animatedSafeAreaStyle,
    contentHeight,
    closeParallax,
  } = useParallaxDrawer(onClose, onMapFlip);

  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

  return (
    <GestureHandlerRootView>
      <AnimatedSafeAreaView style={[S.styles.safeArea, animatedSafeAreaStyle]}>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={() => closeParallax(null)}
            size="small"
            fillColor={colors.themeWhite}
          />
        </S.BackButtonWrapper>
      </AnimatedSafeAreaView>
      <S.BackgroundContainer>
        <Animated.View
          style={[StyleSheet.absoluteFill, animatedBackgroundStyle]}
        >
          <ImageBackground
            source={headerImage}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        </Animated.View>
      </S.BackgroundContainer>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[S.styles.drawer, animatedDrawerStyle]}>
          <S.TopTransparentSection>
            <S.StyledSvg
              width="100%"
              height={SCREEN_WIDTH * (320 / 1440)}
              viewBox="0 0 1440 320"
              preserveAspectRatio="xMidYMid slice"
            >
              <WavyImg />
            </S.StyledSvg>
          </S.TopTransparentSection>

          <S.BottomOpaqueSection>
            <S.Content
              onLayout={(event) => {
                contentHeight.value = event.nativeEvent.layout.height;
              }}
            >
              <S.EmptyContainer>
              {React.isValidElement(children)
                ? React.cloneElement(children, { closeParallax })
                : children}
              </S.EmptyContainer>
            </S.Content>
          </S.BottomOpaqueSection>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ParallaxDrawer;
