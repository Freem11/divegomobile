import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import * as FileSystem from "expo-file-system";
import noImage from "../png/NoImage.png"; // image module

export default function ImageCasher({ photoFile, style }) {
  const [picUri, setPicUri] = useState(null);

  useEffect(() => {
    if (!photoFile) {
      setPicUri(Image.resolveAssetSource(noImage).uri);
      return;
    }

    const loadImage = async () => {
      const fileName = photoFile.split("/").pop();
      const cachePath = FileSystem.cacheDirectory + fileName;
      const remoteUri = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${fileName}`;

      try {
        const cacheInfo = await FileSystem.getInfoAsync(cachePath);

        if (cacheInfo.exists) {
          setPicUri(cacheInfo.uri);
        } else {
          const downloadResumable = FileSystem.createDownloadResumable(remoteUri, cachePath);
          const downloadResult = await downloadResumable.downloadAsync();

          if (downloadResult && downloadResult.uri) {
            setPicUri(downloadResult.uri);
          } else {
            setPicUri(remoteUri); // fallback to remote URL
          }
        }
      } catch (err) {
        console.warn("Image cache error:", err);
        setPicUri(remoteUri); // fallback again
      }
    };

    loadImage();
  }, [photoFile]);

  if (!picUri) return null;

  return <Image source={{ uri: picUri }} style={style} />;
}
