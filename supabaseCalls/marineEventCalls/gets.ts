import { supabase } from "../../supabase";

export const getMarineEvents = async() => {
  const { data, error } = await supabase
    .rpc("get_marineevents");

  const rawData = data as unknown as Array<{ id: number, name: string, coordinates_json: string }> | null;

  if (error) {
    console.error("Couldn't retrieve marine events:", error);
    return [];
  }

  console.log("Raw data retrieved via rpc:", rawData);

  if (rawData) {
    return rawData.map(event => {
      let coordinates = [];
      try {
        const geoJson = JSON.parse(event.coordinates_json);

        if (geoJson.coordinates && geoJson.coordinates.length > 0) {
          coordinates = geoJson.coordinates[0].map(coord => ({
            longitude: coord[0],
            latitude: coord[1]
          }));
        }

      } catch (e) {
        console.error("Failed to parse GeoJSON for event ID:", event.id, e);
      }

      return {
        id: event.id,
        name: event.name,
        coordinates: coordinates,
      };
    });
  }

  return [];
};
