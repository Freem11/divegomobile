import { SeaLife } from "../../entities/seaLIfe";
import { supabase } from "../../supabase";

export const updateSpeciesFact = async (species: string, aiFact: string) => {
    const { data, error } = await supabase
        .from("species")
        .update({ description: aiFact })
        .eq("name", species)
        .select();

    if (error) {
        console.log("couldn't do it UPDATE_SPECIES_FACT,", error);
        return null;
    }

    if (data) {
        return data[0] as SeaLife;
    }
};