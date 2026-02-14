import { create } from "zustand";

export type ActiveSceen = {
  screenName: string,
  params?: {}
};

type State = {
  activeScreen: ActiveSceen | null;
  setActiveScreen: (screenName: string, params?: {}) => void;

};

export const useActiveScreenStore = create<State>((set, get) => ({
  activeScreen: null,
  setActiveScreen: (screenName, params={}) => set({ activeScreen: { screenName, params } }),
}));
