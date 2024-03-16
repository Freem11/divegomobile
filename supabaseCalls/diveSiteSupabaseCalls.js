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

export const getDiveSitesWithUser = async (values) => {
  const { data, error } = await supabase.rpc("get_divesites_with_username", {
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
    userid: values.myDiveSites,
  });

  if (error) {
    console.log("couldn't do it 27,", error);
    return [];
  }

  if (data) {
    // console.log(data)
    return data;
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

export const getDiveSiteWithUserName= async (values) => {
  const { data, error } = await supabase.rpc("get_single_divesites_with_username", {
    sitename: values.siteName,
    sitelat: values.lat,
    sitelng: values.lng,
  });

  if (error) {
    console.log("couldn't do it 27,", error);
    return [];
  }

  if (data) {
    return data;
  }
};


export const getDiveSitesByIDs = async (valueArray) => {
  let Q1 = valueArray.substring(1, valueArray.length)
  let Q2 = Q1.substring(Q1.length-1,0)

  const { data, error } = await supabase
  .from("diveSites")
  .select()
  .or(`id.in.(${Q2})`,)

if (error) {
  console.log("couldn't do it 7,", error);
  return [];
}

if (data) {
  return data;
}
};