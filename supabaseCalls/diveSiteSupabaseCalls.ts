import { DiveSiteBasic } from "../entities/diveSite";
import { GPSBubble } from "../entities/GPSBubble";
import { supabase } from "../supabase";

export const diveSites = async () => {
  const { data, error } = await supabase.from("diveSites").select();

  if (error) {
    console.log("couldn't do it 5,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getDiveSitesBasic = async (
  bubble: GPSBubble
): Promise<DiveSiteBasic[]> => {
  const { data, error } = await supabase
    .from("diveSites")
    .select("id,lat,lng,name")
    .gte("lat", bubble.minLat)
    .gte("lng", bubble.minLng)
    .lte("lat", bubble.maxLat)
    .lte("lng", bubble.maxLng);

  if (error || !data) {
    console.log("couldn't do it,", error);
    return [];
  }

  return data;
};

export const getDiveSitesWithUser = async (values) => {
  const { data, error } = await supabase.rpc("get_divesites_with_username", {
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
    userid: "",
  });

  if (error) {
    console.log("couldn't do it divesite1,", error);
    return [];
  }

  if (data) {
    // console.log(data)
    return data;
  }
};

export const getSiteNamesThatFit = async (value) => {
  if (value === "") {
    return [];
  }

  const { data, error } = await supabase
    .from("diveSites")
    .select()
    .ilike("name", "%" + value + "%");

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const insertDiveSite = async (values) => {
  const { data, error } = await supabase.from("diveSites").insert([
    {
      name: values.name,
      lat: values.lat,
      lng: values.lng,
      UserID: values.UserID,
    },
  ]);

  if (error) {
    console.log("couldn't do it 6,", error);
  }

  if (data) {
    // console.log(data);
    return data;
  }
};

export const getDiveSiteByName = async (value) => {
  const { data, error } = await supabase
    .from("diveSites")
    .select()
    .eq("name", value);

  if (error) {
    console.log("couldn't do it 7,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getDiveSiteWithUserName = async (values) => {
  const { data, error } = await supabase.rpc(
    "get_single_divesite_info_with_username",
    {
      sitename: values.siteName,
      region: values.region,
    }
  );

  if (error) {
    console.log("couldn't do it 7,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getDiveSitesByIDs = async (valueArray) => {
  let Q1 = valueArray.substring(1, valueArray.length);
  let Q2 = Q1.substring(Q1.length - 1, 0);

  const { data, error } = await supabase
    .from("diveSites")
    .select()
    .or(`id.in.(${Q2})`);

  if (error) {
    console.log("couldn't do it 7,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getSingleDiveSiteByNameAndRegion = async (values) => {
  const query = supabase.from("diveSites").select("*").eq("name", values.name);

  if (values.region === undefined) {
  } else {
    if (values.region !== null) {
      query.eq("region", values.region);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.log("couldn't do it 27,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const updateDiveSite = async (values) => {
  const response = await supabase
    .from("diveSites")
    .update(values)
    .eq("id", values.id)
    .select();

    if (response.error) {
      console.log("couldn't do it dive site,", error);
      return [];
    }
      return response;
};

export const getSingleDiveSite = async (lat, lng) => {
  const { data, error } = await supabase
    .from("diveSites")
    .select()
    .eq("lat", lat)
    .eq("lng", lng);

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getDiveSiteById = async (id: string | number) => {
  console.log("supa", id)
  const { data, error } = await supabase.rpc('get_single_divesite_byid_info_with_username', {
    idnum: id,
  });

  if (error) {
    console.log('couldn\'t do it 7,', error);
    return [];
  }

  if (data) {
    return data;
  }
};