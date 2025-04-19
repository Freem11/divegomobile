import MapView from "react-native-maps";
import { create } from "zustand";
import { GPSBubble } from "../../entities/GPSBubble";

type State = {
  mapRef: MapView | null;
  setMapRef: (map: MapView) => void;

  gpsBubble: GPSBubble | null;
  setGpsBubble: (newGpsBubble: GPSBubble) => void;
};

export const useMapStore = create<State>((set, get) => ({
  mapRef: null,
  setMapRef: (newMap) => set({ mapRef: newMap }),

  gpsBubble: null,
  setGpsBubble: (newGpsBubble) => {
    set({ gpsBubble: newGpsBubble });
  },
}));
