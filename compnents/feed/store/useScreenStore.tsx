
import { create } from "zustand";

export const FEED_SCREEN = {
    FEED_MESSAGES: "feedMessages",
    NOTIFICATIONS: "notifications",
    } as const;


type FeedScreen = typeof FEED_SCREEN[keyof typeof FEED_SCREEN];

interface FeedScreenStore {
  currentScreen: FeedScreen;
  isVisible: boolean;
  openScreen: (screen: FeedScreen) => void;
  closeScreen: () => void;
}

export const useFeedScreenStore = create<FeedScreenStore>((set) => ({
  currentScreen: null,
  isVisible: false,
  openScreen: (screen) => set({ currentScreen: screen, isVisible: true }),
  closeScreen: () => set({ currentScreen: null, isVisible: false }),
}));
