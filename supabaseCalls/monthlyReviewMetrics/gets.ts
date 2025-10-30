import { supabase } from "../../supabase";

export const allMetrics = async(site_id: number) => {
  const { data, error } = await supabase
    .from("monthly_dive_condition_metrics")
    .select()
    .eq("divesite_id", site_id);

  if (error) {
    console.log("couldn't do it GET_METRICS,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

