import MapView, { Camera } from "react-native-maps";
import { create } from "zustand";
import { GPSBubble } from "../../entities/GPSBubble";
import { Coordinates } from "../../entities/coordinates";

type State = {
  mapRef: MapView | null;
  setMapRef: (map: MapView) => void;

  // gps bubble (bounding box)
  gpsBubble: GPSBubble | null;
  setGpsBubble: (newGpsBubble: GPSBubble) => void;

  // map camera
  camera: Camera | null;
  setCamera: (camera: Camera) => void;

  // Draggable Marker
  draggablePoint: Coordinates | null;
  setDraggablePoint: (point: Coordinates) => void;
};

export const useMapStore = create<State>((set, get) => ({
  mapRef: null,
  setMapRef: (newMap) => set({ mapRef: newMap }),

  gpsBubble: null,
  setGpsBubble: (newGpsBubble) => {
    set({ gpsBubble: newGpsBubble });
  },

  draggablePoint: null,
  setDraggablePoint: (point) => set({ draggablePoint: point }),
}));
