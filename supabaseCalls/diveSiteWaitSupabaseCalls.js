import { supabase } from "../supabase";

export const diveSiteWaits = async() => {

  const { data, error } = await supabase
    .from("diveSiteWait")
    .select();

  if (error) {
    console.log("couldn't do it 8,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const insertDiveSiteWaits = async(values) => {
  const { data, error } = await supabase
    .from("diveSiteWait")
    .insert([
      {
        name: values.name,
        lat: values.lat,
        lng: values.lng,
        UserID: values.UserID
      },
    ]);

  if (error) {
    console.log("couldn't do it 9,", error);
  }

  return {
    data,
    error,
  };
};

export const grabDiveSiteWaitById = async(id) => {

  const { data, error } = await supabase
    .from("diveSiteWait")
    .select()
    .eq("id", id);

  if (error) {
    console.log("couldn't do it 10,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const deleteDiveSiteWait = async(id) => {

  const { data, error } = await supabase
    .from("diveSiteWait")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("couldn't do it 11,", error);
    return [];
  }

  if (data) {
    return data;
  // console.log(data);
  }
};
