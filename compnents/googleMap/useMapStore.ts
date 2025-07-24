import MapView, { Camera } from "react-native-maps";
import { create } from "zustand";

import { GPSBubble } from "../../entities/GPSBubble";
import { Coordinates } from "../../entities/coordinates";

// type State = {
//   mapRef: MapView | null;
//   // setMapRef: (map: MapView) => void;

//   // gps bubble (bounding box)
//   gpsBubble: GPSBubble | null;
//   // setGpsBubble: (newGpsBubble: GPSBubble) => void;

//   // map camera
//   camera: Camera | null;
//   // setCamera: (camera: Camera) => void;

//   // Draggable Marker
//   draggablePoint: Coordinates | null;
//   // setDraggablePoint: (point: Coordinates) => void;

//   // mapConfig
//   mapConfig: number;
//   // setMapConfig: (config: number) => void;

//   actions: {
//     setMapRef: (map: MapView) => void;
//     setGpsBubble: (newGpsBubble: GPSBubble) => void;
//     setCamera: (camera: Camera) => void;
//     setDraggablePoint: (point: Coordinates) => void;
//     setMapConfig: (config: number) => void;
//   }
// };

const mutator = (set, get) => ({
  mapRef:         null as MapView | null,
  camera:         null as Camera | null,
  gpsBubble:      null as GPSBubble | null,
  mapConfig:      0 as number,
  navProps:       { pageName: "", itemId: 0 },
  draggablePoint: null as Coordinates | null,
  formValues:     {},

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
  },
}
);

export const useMapStore = create<ReturnType<typeof mutator>>(mutator);
