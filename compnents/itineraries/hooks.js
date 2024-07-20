import { getDiveSitesByIDs } from "../../supabaseCalls/diveSiteSupabaseCalls";

export const useMapFlip = async (
  siteList,
  setSitesArray,
  setZoomHelper,
  setLargeModal,
  setMasterSwitch,
  setMapCenter
) => {
  setSitesArray(siteList);
  let itinerizedDiveSites = await getDiveSitesByIDs(JSON.stringify(siteList));

  let lats = [];
  let lngs = [];
  itinerizedDiveSites.forEach((site) => {
    lats.push(site.lat);
    lngs.push(site.lng);
  });
  let moveLat = lats.reduce((acc, curr) => acc + curr, 0) / lats.length;
  let moveLng = lngs.reduce((acc, curr) => acc + curr, 0) / lngs.length;
  setZoomHelper(true);
  setLargeModal(false);
  setMasterSwitch(false);
  setMapCenter({
    lat: moveLat,
    lng: moveLng,
  });
};
