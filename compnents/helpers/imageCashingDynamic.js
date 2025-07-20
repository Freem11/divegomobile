import React, { useState, useEffect, useContext, useRef } from "react";
import { Animated } from "react-native";
import * as FileSystem from "expo-file-system";

import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { SelectedPhotoContext } from "../contexts/selectedPhotoContext";

export default function ImageCasherDynamic(props) {
  const { photoFile, id, style, aspectRatio } = props;

  const fileName = photoFile?.split("/").pop();
  const cacheDir = FileSystem.cacheDirectory + fileName;

  const remoteUri = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${fileName}`;
  const fallbackUri = "https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/MantaWhite.jpg";

  const [picUri, setPicUri] = useState(null);
  const [picHeight, setPicHeight] = useState(0);
  const [picWidth, setPicWidth] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // async function findImageInCache(uri) {
  //   try {
  //     const info = await FileSystem.getInfoAsync(uri);
  //     return { ...info, err: false };
  //   } catch (error) {
  //     return {
  //       exists: false,
  //       err: true,
  //       msg: error,
  //     };
  //   }
  // }

  // async function cacheImage(fromUri, toUri) {
  //   try {
  //     const downloadImage = FileSystem.createDownloadResumable(
  //       fromUri,
  //       toUri,
  //       {}
  //     );
  //     const downloaded = await downloadImage.downloadAsync();
  //     return {
  //       cached: true,
  //       err: false,
  //       path: downloaded.uri,
  //     };
  //   } catch (error) {
  //     return {
  //       cached: false,
  //       err: true,
  //       msg: error,
  //     };
  //   }
  // }

  // useEffect(() => {
  //   let isMounted = true;

  //   async function loadImage() {
  //     const imageExists = await findImageInCache(cacheDir);
  //     if (isMounted) {
  //       if (imageExists.exists) {
  //         setPicUri(cacheDir);
  //       } else {
  //         const result = await cacheImage(remoteUri, cacheDir);
  //         setPicUri(result.cached ? result.path : fallbackUri);
  //       }
  //     }
  //   }

  //   loadImage();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  // useEffect(() => {
  //   if (picUri) {
  //     Image.getSize(
  //       picUri,
  //       (width, height) => {
  //         const ratio = height / width;
  //         setPicWidth(scale(345));
  //         setPicHeight(scale(345) * ratio);
  //       },
  //       (error) => {
  //         console.warn("Failed to get image size", error);
  //       }
  //     );
  //   }
  // }, [picUri]);

  // const togglePhotoBoxModal = (photo) => {
  //   setSelectedPhoto(photo);
  //   setFullScreenModal(true);
  //   setActiveTutorialID("PinchAndZoomPhoto");
  // };

  const handleImageLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // if (!picUri) {
  //   return null; // You can replace this with a loading spinner if needed
  // }

  return (
    <Animated.Image
      source={{ uri: remoteUri }}
      style={{ ...style, width: "100%", aspectRatio: aspectRatio, opacity: fadeAnim }}
      onLoad={handleImageLoad}
    />
  );
}
