import { supabase } from "../supabase";

export const diveSites = async (GPSBubble) => {

  let minLat, maxLat, minLng, maxLng;

  if (GPSBubble.maxLat) {
    minLat = GPSBubble.minLat;
    maxLat = GPSBubble.maxLat;
    minLng = GPSBubble.minLng;
    maxLng = GPSBubble.maxLng;
  } else {
    minLat = GPSBubble.southWest.latitude;
    maxLat = GPSBubble.northEast.latitude;
    minLng = GPSBubble.southWest.longitude;
    maxLng = GPSBubble.northEast.longitude;
  }

  const { data, error } = await supabase
  .from("diveSites")
  .select()
  .gte('lat', minLat)
  .gte('lng', minLng)
  .lte('lat', maxLat)
  .lte('lng', maxLng)

if (error) {
  console.log("couldn't do it,", error)
  return([])
}

if (data) {
  return data
}
};


export const insertDiveSite = async (values) => {

  const { data, error } = await supabase
  .from("diveSites")
  .insert([
    {
      name: values.name,
      lat: values.lat,
      lng: values.lng,
      UserID: values.UserIDs
    },
  ]);

if (error) {
  console.log("couldn't do it,", error);
}

if (data) {
  console.log(data);
}
};