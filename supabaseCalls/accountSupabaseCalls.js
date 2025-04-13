import { supabase } from "../supabase";

export const addDeletedAccountInfo = async (values) => {

  const { data, error } = await supabase
  .from("deletedUsers")
  .insert([
    {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      uuid: values.UserID
    },
  ]);

  if (error) {
    console.log("couldn't do it 0,", error);
  }

  if (data) {
    console.log(data);
  }
};

export const createProfile = async (values) => {

  const { data, error } = await supabase
  .from("UserProfiles")
  .insert([
    {
      Email: values.email,
      UserID: values.id
    },
  ]);

if (error) {
  console.log("couldn't do it 1,", error);
}

if (data) {
  console.log(data);
}
};

export const updateProfile = async (values) => {
  const response = await supabase
    .from("UserProfiles")
    .update({ UserName: values.username, profileBio: values.bio, profilePhoto: values.photo  })
    .eq("UserID", values.id);

  if (response.error) {
    console.log("couldn't do it 2,", error);
    return [];
  }

    return response;
};

export const updatePushToken = async (values) => {
  const { data, error } = await supabase
    .from("UserProfiles")
    .update({expo_push_token: values.token})
    .eq("UserID", values.UserID);

  if (error) {
    console.error("Error while saving the push token, ", error);
    return [];
  } else if (data) {
    return data;
  }

  return []
}

export const updateProfileFeeback = async (values) => {

  console.log(values)

  const { data, error } = await supabase
    .from("UserProfiles")
    .update({ feedbackRequested: true })
    .eq("UserID", values.UserID);

  if (error) {
    console.log("couldn't do it 2,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const deleteProfile = async (id) => {
  const { data, error } = await supabase
    .from("UserProfiles")
    .delete()
    .eq("UserID", id);

  if (error) {
    console.log("couldn't do it 3,", error);
    return [];
  }

  if (data) {
    console.log(data);
  }
};

export const grabProfileById = async (id) => {
  const { data, error } = await supabase
    .from("UserProfiles")
    .select()
    .eq("UserID", id)

  if (error) {
    console.log("couldn't do it 4,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const grabProfileByUserName = async (userName) => {
  const { data, error } = await supabase
    .from("UserProfiles")
    .select()
    .eq("UserName", userName)

  if (error) {
    console.log("couldn't do it 5,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const getProfileWithStats = async (userId) => {
  const { data, error } = await supabase.rpc("get_userprofile_with_stats", {
    userid: userId,
  });

  if (error) {
    console.error("couldn't do it 27,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

