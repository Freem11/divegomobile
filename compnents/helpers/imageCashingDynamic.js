import React, { useRef } from "react";
import { Animated } from "react-native";

export default function ImageCasherDynamic(props) {
  const { photoFile , size, style, aspectRatio } = props;

  let remoteUri;

  if (size === "sm") {
    remoteUri = `${photoFile.public_domain}/${photoFile.sm}`;
  } else if (size === "md"){
    remoteUri = `${photoFile.public_domain}/${photoFile.md}`;
  } else if (size === "lg"){
    remoteUri = `${photoFile.public_domain}/${photoFile.lg}`;
  } else if (size === "xl"){
    remoteUri = `${photoFile.public_domain}/${photoFile.xl}`;
  }

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