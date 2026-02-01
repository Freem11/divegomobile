import React, { useRef } from "react";
import { Animated, ImageStyle, StyleProp } from "react-native";

import { DiveSiteWithUserName } from "../../entities/diveSite";
import { PHOTO_SIZES } from "../../entities/photoSizes";

type ImageCasherDynamicProps = {
  size: string;
  photoFile: DiveSiteWithUserName;
  aspectRatio: number;
  style?: StyleProp<ImageStyle>;
};

export default function ImageCasherDynamic(props: ImageCasherDynamicProps) {
  const { photoFile, size, style, aspectRatio } = props;

  let remoteUri;

  if (size === PHOTO_SIZES.Small) {
    remoteUri = `${photoFile.public_domain}/${photoFile.sm}`;
  } else if (size === PHOTO_SIZES.Medium) {
    remoteUri = `${photoFile.public_domain}/${photoFile.md}`;
  } else if (size === PHOTO_SIZES.Large) {
    remoteUri = `${photoFile.public_domain}/${photoFile.lg}`;
  } else if (size === PHOTO_SIZES.ExtraLarge) {
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