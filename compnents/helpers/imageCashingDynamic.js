import React, { useRef } from "react";
import { Animated } from "react-native";


export default function ImageCasherDynamic(props) {
  const { uri, style, aspectRatio } = props;

  // const fallbackUri = "https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/MantaWhite.jpg";

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
      source={{ uri: uri }}
      style={{ ...style, width: "100%", aspectRatio: aspectRatio, opacity: fadeAnim }}
      onLoad={handleImageLoad}
    />
  );
}