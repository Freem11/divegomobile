import { supabase } from "../../supabase";

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

export const getSpeciesSiteCount = async (species: string) => {
    const { data, error } = await supabase
        .from("speciesSiteCount")
        .select()
        .eq("label", species);

    if (error) {
        console.log("couldn't do it GET_SPECIES_BY_DIVE_SITE,", error);
        return [];
    }

    if (data) {
        return data;
    }
};

export const getSpeciesUserCount = async (species: string) => {
    const { data, error } = await supabase
        .from("speciesUserCount")
        .select()
        .eq("label", species);

    if (error) {
        console.log("couldn't do it GET_SPECIES_BY_USER,", error);
        return [];
    }

    if (data) {
        return data;
    }
};