import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { getFailedUploads, removeFailedUpload } from "./asyncStore";

export const FEED_ITEM_TYPE = {
  FAILED_UPLOAD: "failed_upload",
  FAILED_SYNC: "failed_sync",
  NOTIFICATION: "notification",
} as const;

export type FeedItemType = (typeof FEED_ITEM_TYPE)[keyof typeof FEED_ITEM_TYPE];

export interface BaseFeedItem {
  id: string;
  timestamp: number;
  type: FeedItemType;
  title: string;
  message: string;
}

export interface FailedUploadFeedItem extends BaseFeedItem {
  type: typeof FEED_ITEM_TYPE.FAILED_UPLOAD;
  imageUri: string;

  retryCallback: () => Promise<void>;
}

export interface FailedSyncFeedItem extends BaseFeedItem {
  type: typeof FEED_ITEM_TYPE.FAILED_SYNC;
  reason: string;
  retryCallback: () => Promise<void>;
}

export interface NotificationFeedItem extends BaseFeedItem {
  type: typeof FEED_ITEM_TYPE.NOTIFICATION;
  icon?: string;
  action?: () => void;
}

export type FeedItem =
  | FailedUploadFeedItem
  | FailedSyncFeedItem
  | NotificationFeedItem;

// ----------------------
// Zustand Store Interface
// ----------------------

interface FeedDataStore {
  feedItems: FeedItem[];
  loadFeedItems: () => void;
  addFeedItem: (item: FeedItem) => void;
  removeFeedItem: (id: string) => void;
}

const FEED_ITEMS: FeedItem[] = [
  // {
  //   id: uuidv4(),
  //   type: FEED_ITEM_TYPE.FAILED_UPLOAD,
  //   title: "Upload Failed",
  //   message: "Could not upload image due to network issue",
  //   timestamp: Date.now(),
  //   imageUri:
  //     "file:///data/user/0/com.freem11.divegomobile/cache/ImagePicker/67414f78-c609-445b-aa81-bba91b340fa7.jpeg",
  //   retryCallback: async () => {
  //     console.log("Retrying upload...");
  //   },
  // },
  // {
  //   id: uuidv4(),
  //   type: FEED_ITEM_TYPE.FAILED_SYNC,
  //   title: "Sync Error",
  //   message: "Sync with backend failed.",
  //   timestamp: Date.now(),
  //   reason: "Timeout error",
  //   retryCallback: async () => console.log("Retrying sync..."),
  // },
  // {
  //   id: uuidv4(),
  //   type: FEED_ITEM_TYPE.NOTIFICATION,
  //   title: "Reminder",
  //   message: "Verify your account email.",
  //   timestamp: Date.now(),
  //   icon: "bell",
  //   action: () => console.log("Opening notification..."),
  // },
];

export const useFeedDataStore = create<FeedDataStore>((set) => ({
  feedItems: [],

  loadFeedItems: async () => {
    const failedItems = await getFailedUploads();
    set({ feedItems: [...FEED_ITEMS, ...failedItems] });
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

      return {
        feedItems: state.feedItems.filter((item) => item.id !== id),
      };
    });
  },
}));
