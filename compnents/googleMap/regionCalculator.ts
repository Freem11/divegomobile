import MapView from "react-native-maps";

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