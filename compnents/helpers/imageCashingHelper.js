import * as FileSystem from "expo-file-system";

async function findImageInCache(fileName) {
  try {
    const info = await FileSystem.getInfoAsync(fileName);
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
export { findImageInCache, cacheImage };
