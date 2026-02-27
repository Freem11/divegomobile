import MapView from "react-native-maps";

type Coord = { latitude: number; longitude: number };
type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

/** Build a region from an array of coordinates (e.g. trip sites). Avoids bridge calls to a possibly unmounted map. */
export function computeRegionFromCoordinates(coords: { lat: number; lng: number }[]): Region | null {
  const valid = coords.filter(
    (c) => typeof c?.lat === "number" && typeof c?.lng === "number" && Number.isFinite(c.lat) && Number.isFinite(c.lng)
  );
  if (valid.length === 0) return null;
  const lats = valid.map((c) => c.lat);
  const lngs = valid.map((c) => c.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latitudeDelta = Math.max(maxLat - minLat, 0.02);
  let longitudeDelta = maxLng - minLng;
  if (longitudeDelta < 0) longitudeDelta += 360;
  longitudeDelta = Math.max(longitudeDelta, 0.02);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}

export const calculateRegionFromBoundaries = async (mapRef: MapView) => {
    try {
        const boundaries = await mapRef.getMapBoundaries();
        const northEast = boundaries.northEast;
        const southWest = boundaries.southWest;

        const latitudeDelta = northEast.latitude - southWest.latitude;

        let longitudeDelta = northEast.longitude - southWest.longitude;
        if (longitudeDelta < 0) {
            longitudeDelta = 360 + longitudeDelta;
        }

        const latitude = (northEast.latitude + southWest.latitude) / 2;
        let longitude = (northEast.longitude + southWest.longitude) / 2;
        if (northEast.longitude < southWest.longitude) {
            longitude = (longitude + 360 / 2) % 360 - 180;
        }

        return {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
        };
    } catch (error) {
        console.error("Error getting map boundaries:", error);
        return null;
    }
};