import { create } from "zustand";
export type FeedItem = {
  id: string;
  type: "failed_request";
  message: string;
  timestamp: number;
};

interface FeedDataStore {
  feedItems: FeedItem[];
  loadFeedItems: () => void;
  addFeedItem: (item: FeedItem) => void;
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: "1",
    type: "failed_request",
    message: "Upload photo failed due to network issue",
    timestamp: Date.now(),
  },
  {
    id: "2",
    type: "failed_request",
    message: "Profile update failed (offline)",
    timestamp: Date.now() - 100000,
  },
];

export const useFeedDataStore = create<FeedDataStore>((set) => ({
  feedItems: [],
  loadFeedItems: () => {
    set({ feedItems: FEED_ITEMS });
  },
  addFeedItem: (item) =>
    set((state) => ({
      feedItems: [...state.feedItems, item],
    })),
}));
