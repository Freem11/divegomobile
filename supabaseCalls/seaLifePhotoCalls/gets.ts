import { supabase } from "../../supabase";

export const getPhotoByID = async (id: number) => {
    const { data, error } = await supabase.rpc("get_photo_with_variants_by_id", {
        p_photo_id: id
    });

    if (error) {
        console.log("couldn't do it GET_PHOTO_BY_ID,", error);
        return null;
    }

    // Return the first item if found, otherwise null
    return data && data.length > 0 ? data[0] : null;
};