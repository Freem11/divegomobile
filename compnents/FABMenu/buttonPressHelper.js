export const useButtonPressHelper = (
  activeScreenID,
  previousScreenID,
  screenOpen,
  setter
) => {
  console.log(screenOpen, activeScreenID, previousScreenID, setter)
  if (screenOpen && (activeScreenID === previousScreenID)) {
    setter(false);
  } else if (screenOpen && (activeScreenID !== previousScreenID)) {
    setter(true);
  } else {
    setter(true);
    setTimeout(() => {
      setter(true);
    }, 250);
    
  }
};
