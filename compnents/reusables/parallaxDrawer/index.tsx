import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, ImageBackground, SafeAreaView, View, ViewProps, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
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
import Popover from "react-native-popover-view";
import { Placement } from "react-native-popover-view/dist/Types";
import { moderateScale } from "react-native-size-matters";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

type ParallaxDrawerProps = {
  headerImage: () => React.JSX.Element | string;
  children: React.ReactElement<{ closeParallax?: (mapConfig: number | null) => void, restoreParallax?: () => void, bottomHitCount: number}>;
  onClose: () => void;
  onMapFlip?: () => void;
  handleImageUpload?: () => void;
  isMyShop?: boolean
  isPartnerAccount?: boolean
  popoverConent?: () => React.JSX.Element,
};

const ParallaxDrawer = ({
  headerImage,
  children,
  onClose,
  onMapFlip,
  popoverConent
}: ParallaxDrawerProps) => {
  
  const {
    SCREEN_WIDTH,
    panGesture,
    animatedDrawerStyle,
    animatedBackgroundStyle,
    animatedSafeAreaStyle,
    contentHeight,
    closeParallax,
    restoreParallax,
    bottomHitCount
  } = useParallaxDrawer(onClose, onMapFlip);

  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef<View>(null);
  const { fullScreenModal } = useContext(FullScreenModalContext);
  
  useEffect(() => {
    if(fullScreenModal){
      setIsVisible(false)
    }
  },[fullScreenModal])

  const ButtonIconWithRef = forwardRef<View, ViewProps & { onPress?: () => void }>((props, ref) => (
    <View ref={ref} collapsable={false} style={{marginTop: 3}}>
         <ButtonIcon 
          icon="more"
          size='headerIcon'
          onPress={() => setIsVisible(true)}
        />
    </View>
  ));
  
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
        
        {popoverConent && <S.AltButtonWrapper>
          <ButtonIconWithRef ref={iconRef}/>
        </S.AltButtonWrapper>}
        
        {popoverConent && <Popover
          from={iconRef}
          isVisible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          placement={Placement.AUTO}
          popoverStyle={{borderRadius: moderateScale(10)}}
        >
          {popoverConent()}
        </Popover>}
      </AnimatedSafeAreaView>

      <S.BackgroundContainer>
        <Animated.View
          style={[StyleSheet.absoluteFill, animatedBackgroundStyle]}
        >
          {typeof(headerImage) === "function" ? headerImage() :
              <ImageBackground
                source={headerImage}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
          }
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
            {/* Wrap content with KeyboardAvoidingView + ScrollView */}
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust offset as needed
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                <S.Content
                  onLayout={(event) => {
                    contentHeight.value = event.nativeEvent.layout.height;
                  }}
                >
                  <S.EmptyContainer>
                    {React.isValidElement(children)
                      ? React.cloneElement(children, { closeParallax, restoreParallax, bottomHitCount })
                      : children}
                  </S.EmptyContainer>
                </S.Content>
              </ScrollView>
            </KeyboardAvoidingView>
          </S.BottomOpaqueSection>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ParallaxDrawer;
