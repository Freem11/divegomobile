import React, { useRef, useEffect } from "react";
import { Animated, Image, ImageStyle, StyleProp } from "react-native";

const AnimatedImg = Animated.createAnimatedComponent(Image) as React.ComponentType<any>;

type ImageCasherDynamicLocalProps = {
  photoFile: string;
  aspectRatio: number;
  style?: StyleProp<ImageStyle>;
};

export default function ImageCasherDynamicLocal(props: ImageCasherDynamicLocalProps) {
  const { photoFile, style, aspectRatio } = props;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
  }, [photoFile]);

  const handleImageLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedImg
      source={{ uri: photoFile }}
      style={[
        style,
        {
          width: "100%",
          aspectRatio: aspectRatio,
          opacity: fadeAnim as any,
        },
      ]}
      onLoad={handleImageLoad}
    />
  );
}