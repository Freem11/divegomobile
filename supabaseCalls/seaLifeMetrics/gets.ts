import { SeaLife } from "../../entities/seaLIfe";
import { supabase } from "../../supabase";

export const getSpeciesData = async (species: string) => {
    const { data, error } = await supabase
        .from("species")
        .select()
        .eq("name", species);

    if (error) {
        console.log("couldn't do it GET_SPECIES_DATA,", error);
        return null;
    }

    if (data) {
        return data[0] as SeaLife;
    }
};

export const getSpeciesPhotos = async (species: string) => {
    const { data, error } = await supabase
        .from("photos")
        .select()
        .eq("label", species);

    if (error) {
        console.log("couldn't do it GET_SPECIES_PHOTOS,", error);
        return [];
    }

    if (data) {
        return data;
    }
};
export const getSpeciesSiteCount = async (species: string, limit?: number) => {
    let query = supabase
        .from("speciesSiteCount")
        .select(`
            *,
            original_site_id:site_id, 
            site_id:diveSites (
                name,
                diveSiteProfilePhoto
            )
        `)
        .eq("label", species)
        .order("photo_count", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) return [];

    return data.map(item => ({
        ...item,
        id: item.original_site_id,
        siteName: item.site_id?.name,
        sitePhoto: item.site_id?.diveSiteProfilePhoto
    }));
};
export const getSpeciesUserCount = async (species: string, limit?: number) => {
    let query = supabase
        .from("speciesUserCount")
        .select(`
            *,
            user_id:UserProfiles (
                id,           
                UserName,
                profilePhoto
            )
        `)
        .eq("label", species)
        .order("photo_count", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
        console.log("Error in getSpeciesUserCount:", error);
        return [];
    }

    return data.map(item => ({
        ...item,
        id: item.user_id?.id,
        userName: item.user_id?.UserName,
        profilePhoto: item.user_id?.profilePhoto
    }));
};