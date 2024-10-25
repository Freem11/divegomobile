import React, { useState, useEffect, useContext } from "react";
import { scale } from "react-native-size-matters";
import { Image, TouchableWithoutFeedback } from "react-native";
import * as FileSystem from "expo-file-system";

import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { SelectedPhotoContext } from "../contexts/selectedPhotoContext";

export default function ImageCasherDynamic(Props) {
  const { photoFile, id, style } = Props;

  const { setSelectedPhoto } = useContext(SelectedPhotoContext);
  const { setFullScreenModal } = useContext(
    FullScreenModalContext
  );
  const { setActiveTutorialID } = useContext(
    ActiveTutorialIDContext
  );

  let fileName = photoFile && photoFile.split("/").pop();
  let cacheDir = FileSystem.cacheDirectory + fileName;
  let photoName = photoFile && photoFile.split("/").pop();

  let image = {
    uri: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${photoName}`,
    // uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/${photoFile}`,
    id: fileName,
  };

  let test = {
    uri: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/MantaWhite.jpg`,
    // uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/animalphotos/public/MantaWhite.jpg`,
  };

  const [picUri, setPicUri] = useState(null);
  const [picHeigth, setPicHeigth] = useState(0);
  const [picWidth, setPicWidth] = useState(0);

  async function findImageInCache(fileName) {
    try {
      let info = await FileSystem.getInfoAsync(fileName);
      return { ...info, err: false };
    } catch (error) {
      return {
        exists: false,
        err: true,
        msg: error,
      };
    }
  }

  async function cacheImage(fileName, cacheDir) {
    try {
      const downloadImage = FileSystem.createDownloadResumable(
        fileName,
        cacheDir,
        {}
      );

      const downloaded = await downloadImage.downloadAsync();
      return {
        cached: true,
        err: false,
        path: downloaded.uri,
      };
    } catch (error) {
      return {
        cached: false,
        err: true,
        msg: error,
      };
    }
  }

  useEffect(() => {
    async function loadImage() {
      let imageExisitsInCache = await findImageInCache(cacheDir);
      if (imageExisitsInCache.exists) {
        setPicUri(cacheDir);
      } else {
        let cashing = await cacheImage(image.uri, cacheDir);
        if (cashing.cached) {
          setPicUri(cashing.path);
        } else {
          setPicUri(test.uri);
        }
      }
    }

    loadImage();
  }, []);

  if (picUri) {
    Image.getSize(picUri, (width, height) => {
      let ratio = height / width;
      setPicWidth(scale(345));
      setPicHeigth(scale(345) * ratio);
    });
  }

  const togglePhotoBoxModal = (photo) => {
    setSelectedPhoto(photo);
    setFullScreenModal(true);
    setActiveTutorialID("PinchAndZoomPhoto");
  };


  if (picUri) {
    return (
      <TouchableWithoutFeedback
        key={id}
        onPress={() => togglePhotoBoxModal(picUri)}
      >
        <Image
          source={{ uri: picUri }}
          style={{ ...style, height: picHeigth, width: picWidth }}
        ></Image>
      </TouchableWithoutFeedback>
    );
  }
};
