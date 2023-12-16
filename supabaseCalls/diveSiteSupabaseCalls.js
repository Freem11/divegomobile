import { supabase } from "../supabase";

export const diveSites = async (GPSBubble, myDiveSites) => {

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
  .ilike("userName", "%" + myDiveSites + "%")

if (error) {
  console.log("couldn't do it 5,", error)
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
      UserID: values.UserID,
      userName: values.UserName
    },
  ]);

if (error) {
  console.log("couldn't do it 6,", error);
}

if (data) {
  console.log(data);
}
};

export const getDiveSiteByName = async (value) => {

  const { data, error } = await supabase
  .from("diveSites")
  .select()
  .eq("name", value)

if (error) {
  console.log("couldn't do it 7,", error);
  return [];
}

if (data) {
  return data;
}
};