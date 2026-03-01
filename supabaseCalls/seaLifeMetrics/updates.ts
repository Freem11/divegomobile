import { supabase } from "../../supabase";
import { Image } from "../../entities/image";

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

    const animal: Image = {
        file_name: data[0].photofile,
        public_domain: data[0].public_domain,
        sm: data[0].sm,
        md: data[0].md,
        lg: data[0].lg,
        xl: data[0].xl,
    };

    return {
        ...data[0],
        speciesPhoto: animal,
    };

};