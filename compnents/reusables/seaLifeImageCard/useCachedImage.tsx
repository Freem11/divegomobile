// hooks/useCachedImage.ts
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import * as FileSystem from 'expo-file-system';

const aspectRatioCache: Record<string, number> = {};

export const useCachedImage = ({ uri }: { uri: string }) => {
  const [cachedUri, setCachedUri] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fileName = uri?.split('/').pop();
  const cacheDir = `${FileSystem.cacheDirectory}images/${fileName}`;

  useEffect(() => {
    let isMounted = true;

    const ensureCacheDir = async () => {
      try {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.cacheDirectory}images`,
          { intermediates: true }
        );
      } catch (_) {}
    };

    const findImageInCache = async () => {
      try {
        const info = await FileSystem.getInfoAsync(cacheDir);
        return info.exists;
      } catch {
        return false;
      }
    };

    const cacheImage = async () => {
      try {
        const downloadResumable = FileSystem.createDownloadResumable(
          uri,
          cacheDir,
          {}
        );
        const result = await downloadResumable.downloadAsync();
        return result?.uri || uri;
      } catch {
        return uri;
      }
    };

    const getAspectRatio = async () => {
      if (aspectRatioCache[uri]) return aspectRatioCache[uri];

      return new Promise<number>((resolve) => {
        Image.getSize(
          uri,
          (width, height) => {
            const ratio = width / height;
            aspectRatioCache[uri] = ratio;
            resolve(ratio);
          },
          (err) => {
            console.warn('⚠️ Failed to get image size:', err.message);
            resolve(1); // Fallback to square if failure
          }
        );
      });
    };

    const load = async () => {
      await ensureCacheDir();

      const exists = await findImageInCache();
      const localUri = exists ? cacheDir : await cacheImage();

      const ratio = await getAspectRatio();

      if (!isMounted) return;

      setCachedUri(localUri);
      setAspectRatio(ratio);
      setLoading(false);
    };

    if (uri) load();

    return () => {
      isMounted = false;
    };
  }, [uri]);

  return {
    cachedUri,
    aspectRatio,
    loading,
  };
};
