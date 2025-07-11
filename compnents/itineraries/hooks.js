import { getDiveSitesByIDs } from "../../supabaseCalls/diveSiteSupabaseCalls";

export const useMapFlip = async(
  siteList,
  setSitesArray
) => {

  setSitesArray(siteList);
  const itinerizedDiveSites = await getDiveSitesByIDs(JSON.stringify(siteList));

  const lats = [];
  const lngs = [];
  itinerizedDiveSites.forEach((site) => {
    lats.push(site.lat);
    lngs.push(site.lng);
  });
  const moveLat = lats.reduce((acc, curr) => acc + curr, 0) / lats.length;
  const moveLng = lngs.reduce((acc, curr) => acc + curr, 0) / lngs.length;

  return {moveLat, moveLng}

};
