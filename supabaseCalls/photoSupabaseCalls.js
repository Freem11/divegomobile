import { supabase } from "../supabase";

export const getAnimalNames = async () => {
  const { data, error } = await supabase.from("photos").select("label");

  if (error) {
    console.log("couldn't do it 19,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const insertphoto = async (values, monthID) => {
  const { data, error } = await supabase.from("photos").insert([
    {
      photoFile: values.photoFile,
      label: values.label,
      dateTaken: values.dateTaken,
      latitude: values.latitude,
      longitude: values.longitude,
      month: monthID,
      UserID: values.UserID,
    },
  ]);

  if (error) {
    console.log("couldn't do it 20,", error);
  }
};

export const getAnimalNamesThatFit = async (value) => {
  const { data, error } = await supabase
    .from("photos")
    .select("label")
    .ilike("label", "%" + value + "%")
    .limit(10);

  if (error) {
    console.log("couldn't do it 21,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getPhotosforAnchor = async (value) => {
  const { data, error } = await supabase
    .from("photos")
    .select()
    .ilike("label", "%" + value.animalSelection + "%")
    .eq("month", value.sliderVal)
    .gte("latitude", value.minLat)
    .gte("longitude", value.minLng)
    .lte("latitude", value.maxLat)
    .lte("longitude", value.maxLng);

  if (error) {
    console.log("couldn't do it 22,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getAnimalMultiSelect = async (text) => {
  const { data, error } = await supabase
    .from("photos")
    .select("id, label")
    .ilike("label", "%" + text + "%")
    .limit(10);

  if (error) {
    console.log("couldn't do it 23,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getPhotosforMapArea = async (value, myCreatures) => {
  const { data, error } = await supabase
    .from("photos")
    .select()
    .ilike("label", "%" + value.animal + "%")
    .ilike("UserID", "%" + myCreatures + "%")
    .gte("latitude", value.minLat)
    .gte("longitude", value.minLng)
    .lte("latitude", value.maxLat)
    .lte("longitude", value.maxLng)
    .order("id", { ascending: false });

  if (error) {
    console.log("couldn't do it 26,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getPhotosByDiveSiteWithExtra = async (values) => {
  console.log(values);
  const {
    data,
    error,
  } = await supabase.rpc("get_photos_for_divesite_lat_and_lng_groupby_date", {
    lat: values.lat,
    lng: values.lng
  });

  if (error) {
    console.error("couldn't do it 30,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getPhotosByUserWithExtra = async (userId) => {
  console.log(userId);
  const {
    data,
    error,
  } = await supabase.rpc("get_photos_by_userid_groupby_divesite_date", {
    userid: userId,
  });

  if (error) {
    console.error("couldn't do it 31,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getPhotosWithUser = async (values) => {
  const { data, error } = await supabase.rpc("get_photos_with_user", {
    animals: values.animalMultiSelection,
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
    userid: values.myCreatures,
    connecteduserid: values.userId,
  });

  if (error) {
    console.error("couldn't do it 27,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getPhotosWithUserEmpty = async (values) => {
  const { data, error } = await supabase.rpc("get_photos_with_username", {
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
    userid: values.myCreatures,
    connecteduserid: values.userId,
  });

  if (error) {
    console.log("couldn't do it 28,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getHistoData = async (values) => {
  const { data, error } = await supabase.rpc("histogram3", {
    animals: values.animals,
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
  });

  if (error) {
    console.log("couldn't do it 29,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getRecentPhotos = async (today) => {
  const { data, error } = await supabase.rpc("three_randomz");

  if (error) {
    console.log("couldn't do it 30,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getMostRecentPhoto = async () => {
  const { data, error } = await supabase.rpc("maximum_value");

  if (error) {
    console.log("couldn't do it 31,", error);
    return [];
  }

  if (data) {
    return data;
  }
};
