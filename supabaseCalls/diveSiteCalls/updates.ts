import { DiveSiteWithUserName } from "../../entities/diveSite";
import { supabase } from "../../supabase";

export const updateDiveSiteFact = async (id: number, aiFact: string) => {
    const { data, error } = await supabase
        .from("diveSites")
        .update({ "diveSiteBio": aiFact })
        .eq("id", id)
        .select();

    if (error) {
        console.error("couldn't do it UPDATE_DIVE_SITE_FACT,", error);
        return null;
    }

    if (data && data[0]) {
        return {
            ...data[0],
            divesitebio: data[0].diveSiteBio
        } as DiveSiteWithUserName;
    }
    return null;
};