import React from "react";
import { Image } from "react-native";

import DEFAULT_IMAGE from "../png/NoImage.png";

export default function ImageCasher({ id ,photoFile, style, size }) {
  let remoteUri = null;

  if (photoFile) {
    if (photoFile.public_domain) {
      remoteUri = `${photoFile.public_domain}/${photoFile[size] || photoFile.md}`;
    }
  }

  if (!remoteUri) {
    return <Image source={{ uri: Image.resolveAssetSource(DEFAULT_IMAGE).uri }} style={style}/>;
  }

  return (
    <Image
      source={{ uri: remoteUri }}
      style={style}
      defaultSource={DEFAULT_IMAGE}
    />
  );
}