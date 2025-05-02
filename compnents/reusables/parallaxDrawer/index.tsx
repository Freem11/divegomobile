import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Path } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';
import * as S from './styles';
import ButtonIcon from '../buttonIcon';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const HALF_HEIGHT = SCREEN_HEIGHT / 2;

type ParallaxDrawerProps = {
  headerImage: any;
  children: React.ReactNode[];
  onClose: () => void;
};

const ParallaxDrawer = ({ headerImage, children, onClose }: ParallaxDrawerProps) => {
  const translateY = useSharedValue(HALF_HEIGHT);
  const contentHeight = useSharedValue(0);
  const TOP_SECTION_HEIGHT = moderateScale(70); // Define top section height
  const startY = useSharedValue(0);

  if(translateY.value === 0){
    translateY.value = HALF_HEIGHT
  }
 
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
        const minY = SCREEN_HEIGHT - contentHeight.value - TOP_SECTION_HEIGHT; // Fully expanded
        const maxY = HALF_HEIGHT; // Halfway (initial state)
    
        // Clamp drag during update
        const nextY = startY.value + event.translationY;
        translateY.value = Math.min(maxY, Math.max(minY, nextY));
      })
    .onEnd((event) => {
        const minY = SCREEN_HEIGHT - contentHeight.value - TOP_SECTION_HEIGHT;
        const maxY = HALF_HEIGHT;

      if (event.velocityY < 0) {
        translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [minY, maxY],
          deceleration: 0.985,
        });
      } else {
        translateY.value = withDecay(
          {
            velocity: event.velocityY,
            deceleration: 0.985,
          },
          () => {
            if (translateY.value > HALF_HEIGHT) {
              translateY.value = withTiming(HALF_HEIGHT, {
                duration: 1600,
                easing: Easing.out(Easing.exp),
              });
            }
          }
        );
      }
    });
  
  
  const animatedDrawerStyle = useAnimatedStyle(() => {
    return {
        height: contentHeight.value + TOP_SECTION_HEIGHT, 
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, HALF_HEIGHT, SCREEN_HEIGHT],
      [1, 1.25, 3.25],
    );
    return {
      transform: [{ scale }],
    };
  });


  const closeParallax = () => {
    translateY.value = withTiming(0, { duration: 200 }, (isFinished) => {
      if (isFinished) {
        startY.value = 0;
        translateY.value = 0;
      }
    });
      onClose();
  }
  

  return (
    <GestureHandlerRootView>

    <S.SafeArea>
      <S.BackButtonWrapper>
        <ButtonIcon
          icon="chevron-left"
          onPress={closeParallax}
          size="small"
        />
      </S.BackButtonWrapper>
      </S.SafeArea>
      <S.BackgroundContainer>
        <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundStyle]}>
          <ImageBackground
            source={headerImage}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        </Animated.View>
      </S.BackgroundContainer>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.drawer, animatedDrawerStyle]}>
          <S.TopTransparentSection>
            <S.StyledSvg
              width="100%"
              height={SCREEN_WIDTH * (320 / 1440)}
              viewBox="0 0 1440 320"
              preserveAspectRatio="xMidYMid slice"
            >
              <Path
                fill="#ffffff"
                d="M 0,420 L 0,157.2 C 123.3,116.6 246.7,76.0 401,81.6 C 555.3,87.2 740.7,151.7 919,180.0 C 1097.3,208.3 1268.7,180.0 1540,61.2 L 1440,1320 L 0,1320 Z"
              />
            </S.StyledSvg>
          </S.TopTransparentSection>

          <S.BottomOpaqueSection>
            <S.Content
              onLayout={(event) => {
                contentHeight.value = event.nativeEvent.layout.height;
              }}
            >
                  {Array.isArray(children) ? children.map((child, index) => (
                    <S.EmptyContainer key={index}>
                        {child}
                    </S.EmptyContainer>
                    )) : (
                    <S.EmptyContainer key={0}>
                        {children}
                    </S.EmptyContainer>
                    )}
            </S.Content>
          </S.BottomOpaqueSection>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ParallaxDrawer;

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    // backgroundColor: 'blue'
    overflow: 'hidden',
  }
});
