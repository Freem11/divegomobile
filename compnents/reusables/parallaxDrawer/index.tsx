import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef, createContext } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { Placement } from "react-native-popover-view/dist/Types";
import { moderateScale } from "react-native-size-matters";
import Animated from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import Popover from "react-native-popover-view";
import { useNavigation } from "@react-navigation/native";

import ButtonIcon from "../buttonIcon-new";

import * as S from "./styles";
import { WavyImg } from "./wavyImg";
import { useParallaxDrawer } from "./useParallelDrawer";

// Define the handle type so parents can use it with useRef
export type ParallaxDrawerHandle = {
  close: (mapConfig: number | null, shouldNavigate?: boolean) => void;
};

type ParallaxDrawerProps = {
  headerImage: () => React.JSX.Element | string | any;
  children: React.ReactElement<{ closeParallax?: (mapConfig: number | null) => void, restoreParallax?: () => void, bottomHitCount: number }>;
  onClose: () => void;
  onMapFlip?: () => void;
  handleImageUpload?: () => void;
  isMyShop?: boolean;
  isPartnerAccount?: boolean;
  popoverContent?: (close: () => void) => React.JSX.Element;
  contentScrollY?: SharedValue<number>;
};

export const DrawerGestureContext = createContext<any>(null);

const ParallaxDrawer = forwardRef<ParallaxDrawerHandle, ParallaxDrawerProps>(({
  headerImage,
  children,
  onClose,
  onMapFlip,
  contentScrollY,
  popoverContent
}, ref) => {

  const horizontalScrollRef = useRef(null);

  const {
    SCREEN_WIDTH,
    panGesture,
    animatedDrawerStyle,
    animatedBackgroundStyle,
    contentHeight,
    closeParallax,
    restoreParallax,
    bottomHitCount
  } = useParallaxDrawer(onClose, onMapFlip, contentScrollY, horizontalScrollRef);

  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef<View>(null);
  const navigation = useNavigation();

  // Expose closeParallax to the parent via Ref
  useImperativeHandle(ref, () => ({
    close: (mapConfig: number | null, shouldNavigate: boolean = true) => {
      closeParallax(mapConfig, shouldNavigate);
    }
  }));

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setIsVisible(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <SafeAreaView style={[S.styles.safeArea]}>
            <S.HeaderWrapper>
              <ButtonIcon
                icon="chevron-left"
                size={30}
                onPress={() => closeParallax(null)}
              />

              {popoverContent && (
                <View ref={iconRef} collapsable={false}>
                  <ButtonIcon
                    icon="more"
                    size={20}
                    onPress={() => setIsVisible(true)}
                  />
                </View>
              )}

              {popoverContent && (
                <Popover
                  from={iconRef}
                  isVisible={isVisible}
                  onRequestClose={() => setIsVisible(false)}
                  placement={Placement.AUTO}
                  popoverStyle={{ borderRadius: moderateScale(10) }}
                >
                  {popoverContent(() => setIsVisible(false))}
                </Popover>
              )}
            </S.HeaderWrapper>
          </SafeAreaView>

          <S.BackgroundContainer>
            <Animated.View
              style={[StyleSheet.absoluteFill, animatedBackgroundStyle]}
            >
              {typeof headerImage === "function" ? (
                headerImage()
              ) : (
                <Image
                  source={headerImage}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
              )}
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

              <DrawerGestureContext.Provider value={panGesture}>
                <S.BottomOpaqueSection pointerEvents="box-none">
                  <S.Content
                    onLayout={(event) => {
                      contentHeight.value = event.nativeEvent.layout.height;
                    }}
                  >
                    <S.EmptyContainer pointerEvents="box-none">
                      {React.isValidElement(children)
                        ? React.cloneElement(children, {
                          closeParallax,
                          restoreParallax,
                          bottomHitCount,
                        })
                        : children}
                    </S.EmptyContainer>
                  </S.Content>
                </S.BottomOpaqueSection>
              </DrawerGestureContext.Provider>
            </Animated.View>
          </GestureDetector>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
});

export default ParallaxDrawer;