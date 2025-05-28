import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

/**
 * Hook to check if a local file exists at the given URI.
 * @param uri - Local file URI (e.g., file:///...)
 * @returns An object with existence boolean and resolved URI (or null)
 */
export function useFileExists(uri?: string | { uri: string } | null) {
  const [isExist, setIsExist] = useState(false);
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);

  useEffect(() => {
    const getUri = () => {
      if (!uri) return null;
      if (typeof uri === "string") return uri;
      if (typeof uri === "object" && typeof uri.uri === "string")
        return uri.uri;
      return null;
    };

    const check = async () => {
      const finalUri = getUri();
      if (finalUri) {
        try {
          const info = await FileSystem.getInfoAsync(finalUri);
          setIsExist(info.exists);
          setResolvedUri(info.exists ? finalUri : null);
        } catch (err) {
          console.warn("File existence check failed:", err);
          setIsExist(false);
        }
      } else {
        setIsExist(false);
        setResolvedUri(null);
      }
    };

    check();
  }, [uri]);

  return { isExist, resolvedUri };
}
