import { GPSBubble } from "../entities/GPSBubble";
import { Pagination } from "../entities/pagination";
import { Animal, Photo } from "../entities/photos";
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

export const getAnimalNamesThatFit = async (value: string) => {
  if (value === "") {
    return [];
  }

  const { data, error } = await supabase.rpc("get_unique_photo")
    .ilike("label", "%" + value + "%");

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getSeaCreatures = async (value: string, limit: number) => {
  if (value === "") {
    return [];
  }

  const { data, error } = await supabase.rpc("get_unique_sea_life_with_limit", {
    search_label: value,
    limit_count: limit,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  return data || [];
};

export const getCoordsForSeaLife = async (seaLifeName: string) => {
  const { data, error } = await supabase
    .from("photos")
    .select("label, latitude, longitude")
    .eq("label", seaLifeName);

  if (error) {
    console.log("couldn't do it Sea Life Coords,", error);
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

export const getPhotosforMapArea = async (value) => {
  const { data, error } = await supabase
    .from("photos")
    .select()
    .ilike("label", "%" + value.animal + "%")
    .ilike("UserID", "%" + "" + "%")
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

type GetPhotosParams = {
  lat: number;
  lng: number;
  userId: string;
  limit_count?: number;
};

export const getPhotosByDiveSiteWithExtra = async (values: GetPhotosParams) => {
  const params: {
    lat: number;
    lng: number;
    connecteduserid: string;
    limit_count?: number;
  } = {
    lat: values.lat,
    lng: values.lng,
    connecteduserid: values.userId,
  };

  if (typeof values.limit_count === "number") {
    params.limit_count = values.limit_count;
  }

  const { data, error } = await supabase.rpc(
    "get_photos_for_divesite_with_socials_groupby_date",
    params
  );

  if (error) {
    console.error("couldn't do it: Pulling Grouped Photos,", error);
    return [];
  }

  return data || [];
};

// export const getDiveSitePhotos = async (lat: number, lng: number, userId: string, pagination?: Pagination) => {
//   const builder = supabase.rpc("get_photos_for_divesite_with_social_info", {
//     lat,
//     lng,
//     connecteduserid: userId
//   });

//   if (pagination?.page) {
//     builder.range(pagination.from(), pagination.to());
//   }

//   const { data, error } = await builder;

//     if (error) {
//     console.error("couldn't do it 98,", error);
//     return [];
//   }

//   if (data) {
//     return data;
//   }
// };

export const getDiveSitePhotos = async (lat: number, lng: number, userId: string) => {
  const { data, error } = await supabase.rpc("get_photos_for_divesite_with_social_info_test", {
    lat: lat,
    lng: lng,
    connecteduserid: userId
  });

  if (error) {
    console.error("RPC Error 98:", error);
    return [];
  }

  return data || [];
};

export const getProfilePhotosByUser = async (userId: string, connectedUserId: string, pagination?: Pagination) => {
  console.log(userId, connectedUserId, pagination);

  const builder = supabase.rpc("get_photos_by_userid_with_divesite", {
    userid: userId,
    connecteduserid: connectedUserId
  });

  if (pagination?.page) {
    builder.range(pagination.from(), pagination.to());
  }

  const { data, error } = await builder;

  if (error) {
    console.error("couldn't do it 98,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getPhotosByUserWithExtra = async (userId: string, connectedUserId: string) => {
  const {
    data,
    error,
  } = await supabase.rpc("get_photos_by_userid_groupby_divesite_date", {
    userid: userId,
    connecteduserid: connectedUserId
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

export const getHistoData = async (bubble: GPSBubble, animal: string[]) => {
  const { data, error } = await supabase.rpc("histogram3", {
    animals: animal,
    max_lat: bubble.maxLat,
    min_lat: bubble.minLat,
    max_lng: bubble.maxLng,
    min_lng: bubble.minLng,
  });

  if (error) {
    console.log("couldn't do it,", error);
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

export const getAnimalsInBubble = async (bubble: GPSBubble, filter?: Partial<Photo>, pagination?: Pagination) => {
  const builder = supabase.rpc("get_unique_photo_in_bounds", {
    max_lat: bubble.maxLat,
    min_lat: bubble.minLat,
    max_lng: bubble.maxLng,
    min_lng: bubble.minLng,
  });

  if (filter?.label) {
    builder.ilike("label", "%" + filter.label + "%");
  }

  builder.order("times_seen", { ascending: false });

  if (pagination?.page) {
    builder.range(pagination.from(), pagination.to());
  }

  const { data, error } = await builder;
  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data as Animal[];
  }
  return [];
};

export const getDiveSiteSpeciesCount = async (values) => {
  const { data, error } = await supabase.rpc("get_divesite_species", {
    lat: values.lat,
    lng: values.lng,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data[0];
  }
  return [];
};

export const getDiveSiteSightingCount = async (values) => {
  const { data, error } = await supabase.rpc("get_divesite_sightings", {
    lat: values.lat,
    lng: values.lng,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data[0];
  }
  return [];
};

export const getDiveSiteRecentNinePhotos = async (values): Promise<Animal[]> => {
  const { data, error } = await supabase.rpc("get_divesite_recent_nine", {
    lat: values.lat,
    lng: values.lng,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  const result = [] as Animal[];
  if (data) {
    data.forEach((item: any) => {
      const animal: Animal = {
        label: item.label,
        times_seen: item.times_seen,
        image: {
          file_name: item.photofile,
          public_domain: item.public_domain,
          sm: item.sm,
          md: item.md,
          lg: item.lg,
          xl: item.xl,
        },
      };

      result.push(animal);
    });

  }
  return result;
};

export const getMapSightingCount = async (values) => {
  const { data, error } = await supabase.rpc("get_sightings_on_map", {
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data[0];
  }
  return [];
};

export const getMapSpeciesCount = async (values) => {
  const { data, error } = await supabase.rpc("get_species_on_map", {
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data[0];
  }
  return [];
};