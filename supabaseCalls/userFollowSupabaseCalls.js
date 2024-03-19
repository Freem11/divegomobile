import { supabase } from "../supabase";

export const insertUserFollow = async (userId, followUserId) => {

  // console.log("photo waits gets ", values)

  const { data, error } = await supabase
  .from("followUsers")
  .insert([
    {
      user: userId,
      follows: followUserId,
    },
  ]);

  if (error) {
    console.log("couldn't do it 40,", error);
  }

  if (data) {
    return (data);
  }
};

export const deleteUserFollow = async (id) => {
  const { data, error } = await supabase
    .from("followUsers")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("couldn't do it 41,", error);
    return [];
  }

  // if (data) {
  //   console.log(data);
  // }
};
