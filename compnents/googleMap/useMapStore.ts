import MapView, { Camera } from "react-native-maps";
import { create } from "zustand";

import { GPSBubble } from "../../entities/GPSBubble";
import { Coordinates } from "../../entities/coordinates";

type region = { latitude: number, latitudeDelta: number, longitude: number, longitudeDelta: number };

const mutator = (set, get) => ({
  mapRef: null as MapView | null,
  camera: null as Camera | null,
  gpsBubble: null as GPSBubble | null,
  mapConfig: 0 as number,
  navProps: { pageName: "", itemId: 0 },
  draggablePoint: null as Coordinates | null,
  formValues: {},
  mapRegion: null as region | null,

  actions: {
    setMapRef: (newMap: MapView) => {
      set({ mapRef: newMap });
    },
    setGpsBubble: (newGpsBubble: GPSBubble) => {
      set({ gpsBubble: newGpsBubble });
    },
    setCamera: (newCamera: Camera) => {
      set({ camera: newCamera });
    },
    setDraggablePoint: (point: Coordinates) => {
      set({ draggablePoint: point });
    },
    setMapConfig: (config: number, navProps: { pageName: string, itemId: number }) => {
      set({ mapConfig: config, navProps });
    },
    setFormValues: (values: {}) => {
      set({ formValues: values });
    },
    setMapRegion: (region: region) => {
      set({ mapRegion: region });
    },
  },
}
);

export const useMapStore = create<ReturnType<typeof mutator>>(mutator);
