import * as FileSystem from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";

/**
 * Check if a local file exists at the given URI.
 * @param uri - Local file URI (string or { uri: string })
 * @returns A Promise resolving to an object with `exists` and `resolvedUri`
 */
export async function checkFileExists(
  uri?: string | { uri: string } | null
): Promise<{ isExist: boolean; resolvedUri: string | null }> {
  const resolvedUri =
    typeof uri === "string"
      ? uri
      : typeof uri === "object" && typeof uri.uri === "string"
        ? uri.uri
        : null;

  if (!resolvedUri) return { isExist: false, resolvedUri: null };

  try {
    const info = await FileSystem.getInfoAsync(resolvedUri);
    return {
      isExist: info.exists,
      resolvedUri: info.exists ? resolvedUri : null,
    };
  } catch (err) {
    console.warn("checkFileExists failed:", err);
    return { isExist: false, resolvedUri: null };
  }
}

export async function checkNetworkStatus() {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable ?? false,
    isStableConnection:
      (state.isConnected && state.isInternetReachable) ?? false,
  };
}
