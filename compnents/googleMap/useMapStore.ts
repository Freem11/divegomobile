import MapView, { Camera } from "react-native-maps";
import { create } from "zustand";

import { GPSBubble } from "../../entities/GPSBubble";
import { Coordinates } from "../../entities/coordinates";

import { MapConfigurations } from "./types";

type region = { latitude: number, latitudeDelta: number, longitude: number, longitudeDelta: number };

const mutator = (set, get) => ({
  mapRef: null as MapView | null,
  camera: null as Camera | null,
  gpsBubble: null as GPSBubble | null,
  mapConfig: MapConfigurations.Default,
  initConfig: MapConfigurations.Default,
  navProps: { pageName: "", itemId: 0 },
  draggablePoint: null as Coordinates | null,
  formValues: {},
  mapRegion: null as region | null,
  userLocation: null as Coordinates | null,
  isLocating: false,

  actions: {
    setMapRef: (newMap: MapView | null) => {
      set({ mapRef: newMap });
    },
    clearMapRef: () => {
      set({ mapRef: null });
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
    setMapConfig: (config: MapConfigurations, navProps: { pageName: string, itemId: number }) => {
      set({ mapConfig: config, navProps });
    },
    setInitConfig: (config: MapConfigurations) => {
      set({ initConfig: config });
    },
    setFormValues: (values: {}) => {
      set((state) => ({
        formValues: {
          ...state.formValues,
          ...values,
        }
      }));
    },
    setMapRegion: (region: region) => {
      set({ mapRegion: region });
    },

    setUserLocation: (location: Coordinates | null) => {
      set({ userLocation: location });
    },
    setIsLocating: (isLocating: boolean) => {
      set({ isLocating: isLocating });
    },

    clearFormValues: () => {
      set({ formValues: {} });
    },
  },
}
);

export const useMapStore = create<ReturnType<typeof mutator>>(mutator);