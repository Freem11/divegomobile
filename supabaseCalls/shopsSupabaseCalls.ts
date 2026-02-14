import { DiveShop } from "../entities/diveShop";
import { GPSBubble } from "../entities/GPSBubble";
import { Image } from "../entities/image";
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

export const getDiveShops = async(bubble: GPSBubble, filerValue: string = ""): Promise<DiveShop[]> => {
  const { data, error } = await supabase.rpc("get_dive_shops_with_images", {
    min_lat: bubble.minLat,
    max_lat: bubble.maxLat,
    min_lng: bubble.minLng,
    max_lng: bubble.maxLng,
    filter_value: filerValue
  });

  if (error || !data) {
    console.error("Supabase Error:", error);
    return [];
  }

  const result: DiveShop[] = data.map((item: any) => {
    const shopPhoto: Image = {
      file_name: item.diveShopProfilePhoto,
      public_domain: item.public_domain,
      sm: item.sm,
      md: item.md,
      lg: item.lg,
      xl: item.xl,
    };

    return {
      ...item,
      diveShopProfilePhoto: shopPhoto,
    };
  });

  return result;
};

export const getShopByName = async(value) => {
  const { data, error } = await supabase.from("shops").select().eq("orgname", value);

  if (error) {
    console.log("couldn't do it 32,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const updateDiveShop = async(values) => {
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

export const getShopByUserID = async(value: string): Promise<DiveShop[]> => {
  const { data, error } = await supabase.rpc("get_shop_by_user_id_with_images", {
    p_user_id: value
  });

  if (error) {
    console.log("couldn't do it getShopByUserID,", error);
    return [];
  }

  const result = [] as DiveShop[];
  data.forEach((item: any) => {
    const profilePhoto: Image = {
      file_name: item.diveShopProfilePhoto,
      public_domain: item.public_domain,
      sm: item.sm,
      md: item.md,
      lg: item.lg,
      xl: item.xl,
    };
    const newReview = {
      ...item,
      diveShopProfilePhoto: profilePhoto,
    };

    result.push(newReview);
  });
  return result;
  ;
};

export const getDiveShopById = async(id: number) => {
  const { data, error } = await supabase.rpc("get_dive_shop_by_id_with_images", {
    q_shop_id: id
  });

  if (error) {
    console.log("Error in getDiveShopById:", error);
    return null;
  }

  const profilePhoto: Image = {
    file_name: data[0].diveShopProfilePhoto,
    public_domain: data[0].public_domain,
    sm: data[0].sm,
    md: data[0].md,
    lg: data[0].lg,
    xl: data[0].xl,
  };
  const result = {
    ...data[0],
    diveShopProfilePhoto: profilePhoto,
  };

  return result;
};