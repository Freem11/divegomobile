import { create } from "zustand";
import {
  clearFailedUploads,
  getFailedUploads,
  removeFailedUpload,
} from "./asyncStore";
import { FEED_ITEM_TYPE, FeedItem } from "./types";

// ----------------------
// Zustand Store Interface
// ----------------------

interface FeedDataStore {
  feedItems: FeedItem[];
  loadFeedItems: () => void;
  addFeedItem: (item: FeedItem) => void;
  removeFeedItem: (id: string) => void;
  clearFeedItems: () => void;
}

export const useFeedDataStore = create<FeedDataStore>((set) => ({
  feedItems: [],

  loadFeedItems: async () => {
    const failedItems = await getFailedUploads();
    // here you will fetch other feed items from your API or local storage
    const otherFeedItems: FeedItem[] = []; // Replace with actual fetch logic
    set({ feedItems: [...otherFeedItems, ...failedItems] });
  },

  addFeedItem: (item) =>
    set((state) => ({
      feedItems: [...state.feedItems, item],
    })),

  removeFeedItem: async (id: string) => {
    set((state) => {
      const itemToRemove = state.feedItems.find((item) => item.id === id);
      if (!itemToRemove) return state;

      if (itemToRemove.type === FEED_ITEM_TYPE.FAILED_UPLOAD) {
        removeFailedUpload(id);
      }
      // if (itemToRemove.type === FEED_ITEM_TYPE.PHOTOLIKE) {
      //   removeLikedPhoto(id);
      // }

      return {
        feedItems: state.feedItems.filter((item) => item.id !== id),
      };
    });
  },

  clearFeedItems: async () => {
    await clearFailedUploads();
    // here you will clear other feed items from your API or local storage
    set({ feedItems: [] });
  },
}));
