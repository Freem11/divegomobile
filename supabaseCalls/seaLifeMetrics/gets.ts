import { Animal } from "../../entities/photos";
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

export const getSpeciesPhotos = async (species: string): Promise<Animal[]> => {
    const { data, error } = await supabase.rpc("get_species_photos_with_variants", {
        p_species: species
    });

    if (error) {
        console.log("couldn't do it GET_SPECIES_PHOTOS,", error);
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

export const getSingleSpecies = async (species: string) => {
    const { data, error } = await supabase.rpc("get_single_species_with_images", {
        p_species: species
    });

    if (error) {
        console.log("couldn't do it GET_SINGLE_SPECIES,", error);
        return [];
    }

    if (data) {
        return data as unknown as SeaLife[];
    }

    return [];
};