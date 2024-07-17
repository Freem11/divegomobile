import { supabase } from "../supabase";

export const itineraries = async (IdNo) => {

  const { data, error } = await supabase
  .from("itineraries")
  .select()
  .eq("shopID", IdNo)

if (error) {
  console.log("couldn't do it 34,", error)
  return([])
}

if (data) {
  return data
}
};


export const getItinerariesByUserId = async (id) => {

  const { data, error } = await supabase.rpc(
    "get_itineraries_for_userid", { userid: id }
  );

  if (error) {
    console.log("couldn't do it itineraries7,", error);
    return [];
  }

  if (data) {
    return data;
  }
};


export const getItineraryDiveSiteByIdArray = async (siteIds) => {

  const { data, error } = await supabase.rpc(
    "get_multiple_divesites_with_usernames", { divesitesid: siteIds }
  );

  if (error) {
    console.log("couldn't do it itineraries8,", error);
    return [];
  }

  if (data) {
    return data;
  }
};
