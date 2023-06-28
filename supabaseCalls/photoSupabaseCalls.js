import { supabase } from "../supabase";

export const getAnimalNames = async () => {

  const { data, error } = await supabase
  .from("photos")
  .select("label")

if (error) {
  console.log("couldn't do it,", error);
  return [];
}

if (data) {
  return data;
}
};

  export const insertphoto = async (values, monthID) => {

    const { data, error } = await supabase
    .from("photos")
    .insert([
      {
        photoFile: values.photoFile,
        label: values.label,
        dateTaken: values.dateTaken,
        latitude: values.latitude,
        longitude: values.longitude,
        month: monthID,
        UserID: values.UserID
      },
    ]);

  if (error) {
    console.log("couldn't do it,", error);
  }

  if (data) {
    console.log(data);
  }
  };

  export const getAnimalNamesThatFit = async (value) => {

  const { data, error } = await supabase
  .from("photos")
  .select("label")
  .ilike("label", "%" + value + "%")
  .limit(10)

if (error) {
  console.log("couldn't do it,", error);
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
    .lte("longitude", value.maxLng)

  if (error) {
    console.log("couldn't do it,", error);
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
    .limit(10)
  
  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }
  
  if (data) {
    return data;
  }
  };
    

  export const getPhotosforAnchorMulti = async (value) => {

    let creatureList
    value.animalMultiSelection.forEach(creature => {
   
      if (creatureList === undefined){
        creatureList =  creature + ","
      } else{
        creatureList = creatureList + creature + ","
  
    }
      
    });
  
    let creatureListFinal
  
    if(creatureList !== undefined){
      creatureListFinal = creatureList.slice(0,-1)
   
    }

    if (creatureListFinal === undefined) {
      creatureListFinal = ""
    }

    if (value.animalMultiSelection.length === 0 || value.animalMultiSelection === null) {

      const { data, error } = await supabase
      .from("photos")
      .select()
      .ilike("label", "%" + creatureListFinal + "%")
      // .eq("month", value.sliderVal)
      .gte("latitude", value.minLat)
      .gte("longitude", value.minLng)
      .lte("latitude", value.maxLat)
      .lte("longitude", value.maxLng)
  
    if (error) {
      console.log("couldn't do it,", error);
      return [];
    }
  
    if (data) {
      return data;
    }

   } else {
    const { data, error } = await supabase
    .from("photos")
    .select()
    .filter('label', 'in', '(' + creatureListFinal + ')')
    // .eq("month", value.sliderVal)
    .gte("latitude", value.minLat)
    .gte("longitude", value.minLng)
    .lte("latitude", value.maxLat)
    .lte("longitude", value.maxLng)

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data;
  }
   }
    
  }; 

  export const getPhotosforMapArea = async (value) => {

    const { data, error } = await supabase
    .from("photos")
    .select()
    .gte("latitude", value.minLat)
    .gte("longitude", value.minLng)
    .lte("latitude", value.maxLat)
    .lte("longitude", value.maxLng)

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data;
  }
  }; 

  export const getHistoData = async (values) => {

    const { data, error } = await supabase.rpc("histogram3", {animals: values.animals, max_lat: values.maxLat, min_lat: values.minLat, max_lng: values.maxLng, min_lng: values.minLng})

    if (error) {
      console.log("couldn't do it,", error);
      return [];
    }
  
    if (data) {
      return data;
    }
    }; 


  