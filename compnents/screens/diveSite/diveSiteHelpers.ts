import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";

export default const handleDiveSiteScreen = async(id) => {

  const chosenSite = await getDiveSiteById(id)
  if(chosenSite){
    setSelectedDiveSite(chosenSite[0]);
  }


  setTiles(true);
  setShowFilterer(false);
  filterAnchorPhotos();
  setPreviousButtonID(activeScreen);
  setActiveScreen("DiveSiteScreen");
  useButtonPressHelper(
    "DiveSiteScreen",
    activeScreen,
    levelOneScreen,
    setLevelOneScreen
  );
};