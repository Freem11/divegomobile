import { supabase } from "../supabase";

export const createPartnerAccountRequest = async (values) => {
  const { data, error } = await supabase
  .from("partnerAccountRequests")
  .insert([
    {
      webpageLink : values.webpageLink,
      businessName: values.businessName,
      latitude: values.latitude,
      longitude: values.longitude,
      userId: values.userId
    },
  ]);

if (error) {
  console.log("couldn't do it 33,", error);
}

return {
  data,
  error,
};
};


export const grabRequestById = async (id) => {
  const { data, error } = await supabase
    .from("partnerAccountRequests")
    .select()
    .eq("userId", id)

  if (error) {
    console.log("couldn't do it 4,", error);
    return [];
  }

  if (data) {
    return data;
  }
};