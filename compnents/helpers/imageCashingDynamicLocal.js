import React, { useRef } from "react";
import { Animated } from "react-native";

export default function ImageCasherDynamicLocal(props) {
  const { photoFile, id, style, aspectRatio } = props;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleImageLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.Image
      source={{ uri: photoFile }}
      style={{ ...style, width: "100%", aspectRatio: aspectRatio, opacity: fadeAnim }}
      onLoad={handleImageLoad}
    />
  );
}