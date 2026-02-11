import { Animal } from "../entities/photos";
import { ActiveProfile } from "../entities/profile";
import { supabase } from "../supabase";
import { Image } from "../entities/image";

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
  const response = await supabase
    .from("UserProfiles")
    .insert([
      {
        Email: values.email,
        UserID: values.id,
      },
    ]);

  if (response.error) {
    console.log("Unable to create profile", response.error);
  }

  return response;
};

export const updateProfileUserName = async (values: Partial<ActiveProfile>) => {
  const { data, error } = await supabase
    .from("UserProfiles")
    .update({ UserName: values.UserName })
    .eq("UserID", values.UserID)
    .select();
  if (error) {
    console.log("couldn't do it profile update,", error);
    return null;
  }

  if (data && data[0]) {
    return data[0] as ActiveProfile;
  }

  return null;
};

export const updateProfile = async (values: Partial<ActiveProfile>) => {
  const { data, error } = await supabase
    .from("UserProfiles")
    .update(values)
    .eq("id", values.id)
    .select();

  if (error) {
    console.log("couldn't do it profile update,", error);
    return null;
  }

  if (data[0]) {
    return data[0] as ActiveProfile;
  }

};

export const updatePushToken = async (values) => {
  const { data, error } = await supabase
    .from("UserProfiles")
    .update({ expo_push_token: values.token })
    .eq("UserID", values.UserID);

  if (error) {
    console.error("Error while saving the push token, ", error);
    return [];
  } else if (data) {
    return data;
  }

  return [];
};

export const updateProfileFeeback = async (values) => {

  console.log(values);

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

export const grabProfileByUserId = async (id: string) => {
  const { data, error } = await supabase.rpc("get_profile_by_user_uuid", {
    p_uuid: id
  });

  if (error) {
    console.log("couldn't do it GRAB_PROFILE_BY_USER_ID,", error);
    return null;
  }

  const profilehoto: Image = {
    file_name: data[0].diveSiteProfilePhoto,
    public_domain: data[0].public_domain,
    sm: data[0].sm,
    md: data[0].md,
    lg: data[0].lg,
    xl: data[0].xl,
  };

  return {
    ...data[0],
    profilePhoto: profilehoto,
  };
};

export const grabProfileById = async (id: number) => {
  const { data, error } = await supabase.rpc("get_profile_with_image", {
    p_user_id: id
  });

  if (error) {
    console.log("couldn't do it,", error);
    return null;
  }

  const profilehoto: Image = {
    file_name: data.diveSiteProfilePhoto,
    public_domain: data.public_domain,
    sm: data.sm,
    md: data.md,
    lg: data.lg,
    xl: data.xl,
  };

  return {
    ...data,
    profilePhoto: profilehoto,
  };
};

export const grabProfileByUserName = async (userName) => {
  const { data, error } = await supabase
    .from("UserProfiles")
    .select()
    .eq("UserName", userName);

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

export const getUserSpeciesCount = async (userId: string) => {
  const { data, error } = await supabase.rpc("get_user_species", {
    p_user_id: userId,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data[0];
  }
  return [];
};

export const getUserSightingsCount = async (userId: string) => {
  const { data, error } = await supabase.rpc("get_user_sightings", {
    p_user_id: userId,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data[0];
  }
  return [];
};

export const getDiveSiteRecentNinePhotos = async (userId: string): Promise<Animal[]> => {
  const { data, error } = await supabase.rpc("get_profile_recent_nine", {
    p_user_id: userId
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  const result = [] as Animal[];
  if (data) {
    data.forEach((item: any) => {
      const animal: Animal = {
        label: item.label,
        times_seen: item.times_seen,
        image: {
          file_name: item.photofile,
          public_domain: item.public_domain,
          sm: item.sm,
          md: item.md,
          lg: item.lg,
          xl: item.xl,
        },
      };

      result.push(animal);
    });

  }
  return result;
};

export const getuserReveiewCount = async (user_id: string) => {
  const { data, error } = await supabase.rpc("get_users_review_count", {
    user_id,
  });

  if (error) {
    console.log("couldn't do it,", error);
    return [];
  }

  if (data) {
    return data[0];
  }
  return [];
};