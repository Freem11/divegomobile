import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, ImageBackground, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { Placement } from "react-native-popover-view/dist/Types";
import { moderateScale } from "react-native-size-matters";
import Animated from "react-native-reanimated";
import Popover from "react-native-popover-view";
import { useNavigation } from "@react-navigation/native";

import ButtonIcon from "../buttonIcon-new";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

import * as S from "./styles";
import { WavyImg } from "./wavyImg";
import { useParallaxDrawer } from "./useParallelDrawer";

type ParallaxDrawerProps = {
  headerImage: () => React.JSX.Element | string;
  children: React.ReactElement<{ closeParallax?: (mapConfig: number | null) => void, restoreParallax?: () => void, bottomHitCount: number }>;
  onClose: () => void;
  onMapFlip?: () => void;
  handleImageUpload?: () => void;
  isMyShop?: boolean
  isPartnerAccount?: boolean
  popoverContent?: () => React.JSX.Element,
};

const ParallaxDrawer = ({
  headerImage,
  children,
  onClose,
  onMapFlip,
  popoverContent
}: ParallaxDrawerProps) => {

  const {
    SCREEN_WIDTH,
    panGesture,
    animatedDrawerStyle,
    animatedBackgroundStyle,
    contentHeight,
    closeParallax,
    restoreParallax,
    bottomHitCount
  } = useParallaxDrawer(onClose, onMapFlip);

  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef<View>(null);
  const { fullScreenModal } = useContext(FullScreenModalContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (fullScreenModal) {
      setIsVisible(false);
    }
  }, [fullScreenModal]);

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
                  {popoverContent()}
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
                <ImageBackground
                  source={headerImage}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
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

              <S.BottomOpaqueSection>
                <S.Content
                  onLayout={(event) => {
                    contentHeight.value = event.nativeEvent.layout.height;
                  }}
                >
                  <S.EmptyContainer>
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
            </Animated.View>
          </GestureDetector>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );

};

export default ParallaxDrawer;
