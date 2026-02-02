import React, { useRef } from "react";
import { Animated, Image, ImageStyle, StyleProp } from "react-native";

import DEFAULT_IMAGE from "../../png/NoImage.png";
import { PHOTO_SIZES, PhotoVariantSet } from "../../../entities/photoSizes";
import { cloudflareBucketUrl } from "../../globalVariables";

type FadeInImageProps = {
  photoFile: PhotoVariantSet;
  size: PHOTO_SIZES;
  style?: StyleProp<ImageStyle>;
};

export default function FadeInImage({ photoFile, style, size }: FadeInImageProps) {

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleImageLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  let remoteUri: string;

  if (photoFile.public_domain) {
    if (size === PHOTO_SIZES.Small) {
      remoteUri = `${photoFile.public_domain}/${photoFile.sm}`;
    } else if (size === PHOTO_SIZES.Medium) {
      remoteUri = `${photoFile.public_domain}/${photoFile.md}`;
    } else if (size === PHOTO_SIZES.Large) {
      remoteUri = `${photoFile.public_domain}/${photoFile.lg}`;
    } else if (size === PHOTO_SIZES.ExtraLarge) {
      remoteUri = `${photoFile.public_domain}/${photoFile.xl}`;
    }
  } else {
    if (photoFile.photofile) {
      remoteUri = photoFile.photofile;
    } else if (photoFile.original_image) {
      remoteUri = `${cloudflareBucketUrl}${photoFile?.original_image.split("/").pop()}`;
    }
  }

  if (!remoteUri) {
    return <Image source={{ uri: Image.resolveAssetSource(DEFAULT_IMAGE).uri }} style={style} />;
  }

  return (
    <Animated.Image
      source={{ uri: remoteUri }}
      onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
      style={{ ...style, width: "100%", height: "100%", opacity: fadeAnim as any }}
      defaultSource={DEFAULT_IMAGE}
      onLoad={handleImageLoad}
    />
  );
}