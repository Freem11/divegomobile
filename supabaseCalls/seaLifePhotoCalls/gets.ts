import { supabase } from "../../supabase";

export const getPhotoByID = async (id: number) => {
    const { data, error } = await supabase
        .from("photos")
        .select()
        .eq("id", id);

    if (error) {
        console.log("couldn't do it GET_PHOTO_BY_ID,", error);
        return [];
    }

    if (data) {
        return data;
    }
};