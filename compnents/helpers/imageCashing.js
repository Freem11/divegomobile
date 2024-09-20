import React, { useState, useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import * as FileSystem from "expo-file-system";

export default function ImageCasher(Props) {
  const { photoFile, style } = Props;
  let fileName = photoFile.split("/").pop();
  let cacheDir = FileSystem.cacheDirectory + fileName;

  let photoName = photoFile.split("/").pop();

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
  const [isDownloaded, setIsDownloaded] = useState(0);

  const [picHeigth, setPicHeigth] = useState(0);
  const [picWidth, setPicWidth] = useState(0);

  // const callback = (downloadProgress) => {
  //   const progress =
  //     downloadProgress.totalBytesWritten /
  //     downloadProgress.totalBytesExpectedToWrite;
  //   console.log("callback?", progress);
  //   setIsDownloaded(progress);
  // };

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
      // console.log("this?", imageExisitsInCache)
      if (imageExisitsInCache.exists) {
        setPicUri(cacheDir);
      } else {
        let cashing = await cacheImage(image.uri, cacheDir);
        // console.log("that?", cashing)
        if (cashing.cached) {
          setPicUri(cashing.path);
        } else {
          // console.log("main", cashing.cached)
          setPicUri(test.uri);
        }
      }
    }

    loadImage();
  }, []);

  if (picUri) {
    return <Image source={{ uri: picUri }} style={{ ...style }}></Image>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
