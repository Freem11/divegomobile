import AsyncStorage from "@react-native-async-storage/async-storage";
import { FeedItem } from "./useFeedDataStore";

const FAILED_UPLOADS_KEY = "FAILED_UPLOADS";

export async function saveFailedUpload(item: FeedItem) {
  try {
    const existing = await AsyncStorage.getItem(FAILED_UPLOADS_KEY);
    const items: FeedItem[] = existing ? JSON.parse(existing) : [];
    items.push(item);
    await AsyncStorage.setItem(FAILED_UPLOADS_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save upload:", err);
  }
}

export async function getFailedUploads(): Promise<FeedItem[]> {
  try {
    const result = await AsyncStorage.getItem(FAILED_UPLOADS_KEY);
    return result ? JSON.parse(result) : [];
  } catch (err) {
    console.error("Failed to load uploads:", err);
    return [];
  }
}

export async function clearFailedUploads() {
  try {
    await AsyncStorage.removeItem(FAILED_UPLOADS_KEY);
  } catch (err) {
    console.error("Failed to clear uploads:", err);
  }
}
