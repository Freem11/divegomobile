import React, { useEffect, useRef } from "react";
import { Animated, Image, ImageStyle, StyleProp } from "react-native";

import DEFAULT_IMAGE from "../png/NoImage.png";
import { PHOTO_SIZES, PhotoVariantSet } from "../../../entities/photoSizes";

type FadeInImageProps = {
  photoFile: PhotoVariantSet;
  size: PHOTO_SIZES;
  style?: StyleProp<ImageStyle>;
  aspectRatio: number
};

export default function FadeInImage({ photoFile, style, size, aspectRatio }: FadeInImageProps) {

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

  if (!remoteUri) {
    return <Image source={{ uri: Image.resolveAssetSource(DEFAULT_IMAGE).uri }} style={style} />;
  }

  return (
    <Animated.Image
      source={{ uri: remoteUri }}
      style={{ ...style, width: "100%", aspectRatio: aspectRatio, opacity: fadeAnim as any }}
      defaultSource={DEFAULT_IMAGE}
      onLoad={handleImageLoad}
    />
  );
}