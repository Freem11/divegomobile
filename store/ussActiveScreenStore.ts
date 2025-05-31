import { create } from "zustand";

type ActiveSceen = {
    screenName: string,
    parmas?: {}
  }

type State = {
  activeScreen: ActiveSceen | null;
  setActiveScreen: (screenName: string, parmas?: {}) => void;

};

export const useActiveScreenStore = create<State>((set, get) => ({
  activeScreen: null,
  setActiveScreen: (screenName, parmas={}) => set({activeScreen: {screenName, parmas}}),
}));
