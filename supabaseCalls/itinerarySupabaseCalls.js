import { supabase } from "../supabase";

export const itineraries = async (IdNo) => {
  const { data, error } = await supabase
    .from("itineraries")
    .select()
    .eq("shopID", IdNo);

  if (error) {
    console.log("couldn't do it 34,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getItinerariesByUserId = async (id) => {
  const { data, error } = await supabase.rpc("get_itineraries_for_userid", {
    userid: id,
  });

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
    "get_multiple_divesites_with_usernames",
    { divesitesid: siteIds }
  );

  if (error) {
    console.log("couldn't do it itineraries8,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const insertItinerary = async (values) => {
  const { data, error } = await supabase.from("itineraries").insert([
    {
      shopID: values.shopID,
      tripName: values.tripName,
      startDate: values.startDate,
      endDate: values.endDate,
      price: values.price,
      description: values.description,
      siteList: values.siteList,
      BookingPage: values.BookingPage,
    },
  ]);

  if (error) {
    console.log("couldn't do it 03,", error);
  }

  if (data) {
    return data;
    // console.log(data);
  }
};

export const insertItineraryRequest = async (values, reqType) => {
  const { data, error } = await supabase.from("itineraryRequests").insert([
    {
      shopID: values.shopID,
      tripName: values.tripName,
      startDate: values.startDate,
      endDate: values.endDate,
      price: values.price,
      description: values.description,
      siteList: values.siteList,
      BookingPage: values.BookingPage,
      requestType: reqType,
      OriginalItineraryID: values.OriginalItineraryID,
    },
  ]);

  if (error) {
    console.log("couldn't do it 03,", error);
  }

  if (data) {
    return data;
    // console.log(data);
  }
};

export const getItinerariesForDiveSite = async (IdNo) => {
  const { data, error } = await supabase
    .from("itineraries")
    .select()
    .contains("siteList", [IdNo]);

  if (error) {
    console.log("couldn't do it 37,", error);
    return [];
  }

  if (data) {
    return data;
  }
};
