import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import * as FileSystem from "expo-file-system";

export default function ImageCasher(Props) {
  const { photoFile, id } = Props;
  let fileName = photoFile.split("/").pop();
  let cacheDir = FileSystem.cacheDirectory + fileName;

  let image = {
    uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/${photoFile}`,
    id,
  };

  let test = {
    uri:  `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/animalphotos/public/1696100104943.jpeg`,
  };

  const [picUri, setPicUri] = useState(test.uri);


  async function findImageInCache(fileName) {
    try {
      let info = await FileSystem.getInfoAsync(cacheDir);
      return { ...info, err: false };
    } catch (error) {
      return {
        exists: false,
        err: true,
        msg: error,
      };
    }
  }

  async function cacheImage(fileName, cacheDir, callback) {
    try {
      const downloadImage = FileSystem.createDownloadResumable(
        fileName,
        cacheDir,
        {},
        callback
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

    async function loadImage(){

      let imageExisitsInCache = await findImageInCache(fileName);

      if (imageExisitsInCache.exists) {
        setPicUri(cacheDir);
      } else {
        let cashing = await cacheImage(image.uri, cacheDir, () => {});
        if (cashing.cached) {
          setPicUri(cashing.path);
        } else {
          setPicUri(test.uri);
        }
      }
    }

    loadImage()

   
  }, []);

  return ( 
    <Image
      source={{ uri: picUri }}
      style={{
        height: 70,
        minWidth: 120,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        resizeMode: "cover",
      }}
    ></Image>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
