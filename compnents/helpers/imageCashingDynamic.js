import React, { useRef } from "react";
import { Animated } from "react-native";

import cloudflareBucketUrl from "../globalVariables";

export default function ImageCasherDynamic(props) {
  const { photoFile, id, style, aspectRatio } = props;

  const fileName = photoFile?.split("/").pop();

  const remoteUri = `${cloudflareBucketUrl}${fileName}`;
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
      source={{ uri: remoteUri }}
      style={{ ...style, width: "100%", aspectRatio: aspectRatio, opacity: fadeAnim }}
      onLoad={handleImageLoad}
    />
  );
}