import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';
import * as S from './styles';
import ButtonIcon from '../buttonIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HALF_HEIGHT = SCREEN_HEIGHT / 2;
const svgYOffset = SCREEN_HEIGHT > 800 ? -10 : 0;

type ParallaxDrawerProps = {
  headerImage: any;
  children: React.ReactNode[];
  onClose: () => void;
};

const ParallaxDrawer = ({ headerImage, children, onClose }: ParallaxDrawerProps) => {
  const translateY = useSharedValue(HALF_HEIGHT);
  const contentHeight = useSharedValue(0);
  const minTranslateY = useSharedValue(0); // Allow downward pull
  const TOP_SECTION_HEIGHT = moderateScale(70); // Define top section height

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      const maxTranslateY = SCREEN_HEIGHT; // Prevent drawer from being pulled up past top of screen
  
      // Correct minTranslateY to ensure content can fully reveal without clipping
      const minTranslateY = SCREEN_HEIGHT - contentHeight.value - TOP_SECTION_HEIGHT; 
  
      // Ensure the drawer stops at the bottom and doesn't go past the top
      translateY.value = Math.max(
        minTranslateY,  // Prevent it from going past the content reveal height
        Math.min(ctx.startY + event.translationY, maxTranslateY)  // Limit translation
      );
    },
    onEnd: (event) => {
      const maxTranslateY = SCREEN_HEIGHT; // Prevent drawer from exceeding screen height
      const minTranslateY = SCREEN_HEIGHT - contentHeight.value - TOP_SECTION_HEIGHT; // Correct stop point
  
      if (translateY.value < 0) {
        translateY.value = withTiming(0, { duration: 300 }); // Bounce back if over-pulled down
        return;
      }
  
      // Handle velocity and stop at the correct position
      if (event.velocityY < 0) {
        // Swiping up (reveal content)
        translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [minTranslateY, maxTranslateY],  // Ensure it stops at the content height
          deceleration: 0.985,
        });
      } else {
        // Swiping down (bounce back or settle)
        translateY.value = withTiming(
          contentHeight.value < SCREEN_HEIGHT
            ? SCREEN_HEIGHT - contentHeight.value // Show the content or snap to half if expanded
            : HALF_HEIGHT,
          { duration: 300 }
        );
      }
    },
  });
  
  const animatedDrawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, HALF_HEIGHT, SCREEN_HEIGHT],
      [1, 1.25, 3.25],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <S.BackButtonWrapper>
        <ButtonIcon
          icon="chevron-left"
          onPress={onClose}
          size="small"
        />
      </S.BackButtonWrapper>

      <Animated.View style={[styles.backgroundContainer, animatedBackgroundStyle]}>
        <ImageBackground
          source={headerImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.drawer, animatedDrawerStyle]}>
          <View style={styles.topTransparentSection}>
            <Svg
              width="100%"
              height={SCREEN_WIDTH * (320 / 1440)}
              viewBox="0 0 1440 320"
              preserveAspectRatio="xMidYMid slice"
              style={{
                position: 'absolute',
                top: svgYOffset,
                zIndex: 5,
                backgroundColor: 'transparent',
              }}
            >
              <Path
                fill="#ffffff"
                d="M 0,420 L 0,157.2 C 123.3,116.6 246.7,76.0 401,81.6 C 555.3,87.2 740.7,151.7 919,180.0 C 1097.3,208.3 1268.7,180.0 1540,61.2 L 1440,1320 L 0,1320 Z"
              />
            </Svg>
          </View>

          <View style={styles.bottomOpaqueSection}>
            <View
              style={styles.content}
              onLayout={(event) => {
                contentHeight.value = event.nativeEvent.layout.height;
              }}
            >
              {children}
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default ParallaxDrawer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    height: HALF_HEIGHT * 1.1,
    width: '100%',
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    zIndex: 2,
    overflow: 'hidden',
  },
  topTransparentSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: moderateScale(100),
    backgroundColor: 'rgba(255, 255, 255, 0)',
    zIndex: 1,
  },
  bottomOpaqueSection: {
    position: 'absolute',
    top: moderateScale(75),
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 3,
  },
  content: {
    zIndex: 3,
    paddingVertical: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
