import { DiveShop } from "../entities/diveShop";
import { GPSBubble } from "../entities/GPSBubble";
import { supabase } from "../supabase";

// export const sss = async (GPSBubble) => {
//   let minLat, maxLat, minLng, maxLng;

//   if (GPSBubble.maxLat) {
//     minLat = GPSBubble.minLat;
//     maxLat = GPSBubble.maxLat;
//     minLng = GPSBubble.minLng;
//     maxLng = GPSBubble.maxLng;
//   } else {
//     minLat = GPSBubble.southWest.latitude;
//     maxLat = GPSBubble.northEast.latitude;
//     minLng = GPSBubble.southWest.longitude;
//     maxLng = GPSBubble.northEast.longitude;
//   }

//   const { data, error } = await supabase
//     .from("shops")
//     .select()
//     .gte("lat", minLat)
//     .gte("lng", minLng)
//     .lte("lat", maxLat)
//     .lte("lng", maxLng);

//   if (error) {
//     console.log("couldn't do it 31,", error);
//     return [];
//   }

//   if (data) {
//     return data;
//   }
// };

export const getDiveShops = async (bubble: GPSBubble, filerValue: string = ""): Promise<DiveShop[]> => {
  let query = supabase
    .from("shops")
    .select()
    .gte("lat", bubble.minLat)
    .gte("lng", bubble.minLng)
    .lte("lat", bubble.maxLat)
    .lte("lng", bubble.maxLng);

  if (filerValue && filerValue.trim()) {
    query = query.ilike("orgName", "%" + filerValue + "%");
  }

  const { data, error } = await query;

  if (error || !data) {
    console.log("couldn't do it,", error);
    return [];
  }

  return data;
};

export const getShopByName = async (value) => {
  const { data, error } = await supabase.from("shops").select().eq("orgname", value);

  if (error) {
    console.log("couldn't do it 32,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const updateDiveShop = async (values) => {
  const { data, error } = await supabase
    .from("shops")
    .update(values)
    .eq("id", values.id)
    .select();

    if (error) {
      console.log("couldn't do it dive shop update,", error);
      return null;
    }
  
    if (data[0]) {
      return data[0] as DiveShop;
    }
};

export const getShopByUserID = async (value: string) => {
  const { data, error } = await supabase
    .from('shops')
    .select()
    .eq('userId', value);

  if (error) {
    console.log('couldn\'t do it 39,', error);
    return [];
  }

  if (data) {
    return data as DiveShop[];
  }
};

export const getDiveShopById = async (id: number) => {
  const { data, error } = await supabase
    .from('shops')
    .select()
    .eq('id', id);

  if (error) {
    console.log('couldn\'t do it 39,', error);
  }

  if (data) {
    return data;
  }
};