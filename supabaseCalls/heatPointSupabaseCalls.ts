import { GPSBubble } from "../entities/GPSBubble";
import { HeatPoint } from "../entities/heatPoint";
import { supabase } from "../supabase";

type HeatPointFilter = {
  animal?: string[]
};

export const getHeatPoints = async (bubble: GPSBubble, filter?: HeatPointFilter) => {
  const builder = supabase
    .from("heatPoints")
    .select("lat,lng,weight")
    .gte("lat", bubble && bubble.minLat)
    .gte("lng", bubble && bubble.minLng)
    .lte("lat", bubble && bubble.maxLat)
    .lte("lng", bubble && bubble.maxLng);

  if (filter?.animal?.length) {
    builder.in("animal", filter.animal);
  }

  const { data } = await builder;

  return data as HeatPoint[];
};

// not in use
// export const heatPoints = async (GPSBubble, slider, animal) => {

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

//   let animalVal
//   if (animal === "All"){
//     animalVal = ""
//   } else {
//     animalVal = animal
//   }

//   const { data, error } = await supabase
//     .from("heatPoints")
//     .select()
//     .ilike("animal", "%" + animalVal + "%")
//     .eq("month", slider)
//     .gte("lat", minLat)
//     .gte("lng", minLng)
//     .lte("lat", maxLat)
//     .lte("lng", maxLng)

//   if (error) {
//     console.log("couldn't do it 12,", error);
//     return [];
//   }

//   if (data) {
//     return data;
//   }
//   }

// not in use
// export const getLoneHeatPoint = async (values) => {
//   const { data, error } = await supabase
//     .from("heatPoints")
//     .select()
//     .eq("animal", values.animal)
//     .eq("month", values.month)
//     .gte("lat", values.minLat)
//     .gte("lng", values.minLng)
//     .lte("lat", values.maxLat)
//     .lte("lng", values.maxLng)
//     .limit(1)

//   if (error) {
//     console.log("couldn't do it 13,", error);
//     return [];
//   }

//   if (data) {
//     return data;
//   }
// };

// not in use
// export const insertHeatPoint = async (values) => {
//   const { data, error } = await supabase.from("heatPoints").insert([
//     {
//       animal: values.animal,
//       month: values.month,
//       lat: values.lat,
//       lng: values.lng,
//       weight: 1,
//     },
//   ]);

//   if (error) {
//     console.log("couldn't do it 14,", error);
//   }

//   if (data) {
//     console.log(data);
//   }
// };

// not in use
// export const updateHeatPoint = async (values) => {

//   let newWeight = values.weight + 1

//   const { data, error } = await supabase
//     .from("heatPoints")
//     .update({ weight: newWeight })
//     .eq("id", values.id);

//   if (error) {
//     console.log("couldn't do it 15,", error);
//     return [];
//   }

//   if (data) {
//     return data;
//   }
// };

// not in use
// export const multiHeatPoints = async (GPSBubble, animalArray, myCreatures) => {
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

//   let creatureList;
//   if (animalArray.length === 0 || animalArray === null) {
//     creatureList = "";

//     const { data, error } = await supabase
//     .from("heatPoints")
//     .select()
//     .ilike("animal", "%" + creatureList + "%")
//     .ilike("userName", "%" + myCreatures + "%")
//     // .eq("month", slider)
//     .gte("lat", minLat)
//     .gte("lng", minLng)
//     .lte("lat", maxLat)
//     .lte("lng", maxLng);

//   if (error) {
//     console.log("couldn't do it 16,", error);
//     return [];
//   }

//   if (data) {
//     return data;
//   }

//   } else {
//     animalArray.forEach((creature) => {
//       if (creatureList === undefined ) {
//         creatureList = creature + ",";
//       } else {
//         creatureList = creatureList + creature + ",";
//       }
//     });

//   let creatureListFinal;

//   if (creatureList !== undefined) {
//     creatureListFinal = creatureList.slice(0, -1);
//   }

//   const { data, error } = await supabase
//     .from("heatPoints")
//     .select()
//     .filter('animal', 'in', '(' +  creatureListFinal + ')')
//     // .eq("month", slider)
//     .gte("lat", minLat)
//     .gte("lng", minLng)
//     .lte("lat", maxLat)
//     .lte("lng", maxLng);

//   if (error) {
//     console.log("couldn't do it 17,", error);
//     return [];
//   }

//   if (data) {
//     return data;
//   }
// }

// };

/** @deprecated */
export const getHeatPointsWithUser = async (values) => {
  const { data, error } = await supabase.rpc("get_heatpoints_with_user", {
    animals: values.animalMultiSelection,
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
    userid: "",
  });

  if (error) {
    console.log("couldn't do it heatpoint1,", error);
    return [];
  }

  if (data) {
    return data;
  }
};
/** @deprecated */
export const getHeatPointsWithUserEmpty = async (values) => {
  const { data, error } = await supabase.rpc("get_heatpoints_with_username", {
    max_lat: values.maxLat,
    min_lat: values.minLat,
    max_lng: values.maxLng,
    min_lng: values.minLng,
    userid: "",
  });

  if (error) {
    console.log("couldn't do it heatpoint2,", error);
    return [];
  }

  if (data) {
    // console.log(data)
    return data;
  }
};

// not in use
// export const picClickheatPoints = async (GPSBubble, animal) => {
//   // console.log("HIHIHIH", GPSBubble, animal)
//   let animalVal;
//   if (animal === null) {
//     animalVal = "";
//   } else {
//     animalVal = animal;
//   }

//   // console.log("gogogog", GPSBubble, animalVal)

//   const { data, error } = await supabase
//     .from("heatPoints")
//     .select()
//     .ilike("animal", "%" + animalVal + "%")
//     .gte("lat", GPSBubble.minLat)
//     .gte("lng", GPSBubble.minLng)
//     .lte("lat", GPSBubble.maxLat)
//     .lte("lng", GPSBubble.maxLng);

//   if (error) {
//     console.log("couldn't do it 18,", error);
//     return [];
//   }

//   if (data) {
//     return data;
//   }
// };