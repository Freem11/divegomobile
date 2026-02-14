import MapView, { BoundingBox } from "react-native-maps";
import { create } from "zustand";

type State = {
  map: MapView | null;
  setMap: (map: MapView) => void;

  boundaries: BoundingBox | null;
  updateBoundaries: () => void;
};

export const useMapStore = create<State>((set, get) => ({
  map: null,
  setMap: (newMap) => set({ map: newMap }),

  boundaries: null,
  updateBoundaries: async() => {
    const state = get();
    if (!state.map) {
      return null;
    }

    const boundaries = await state.map.getMapBoundaries();
    if (!boundaries) {
      return null;
    }

    console.log("boundaries", boundaries);
    set({ boundaries });
  },
}));
