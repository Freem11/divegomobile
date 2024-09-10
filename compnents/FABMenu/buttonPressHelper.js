export const useButtonPressHelper = (
  activeScreenID,
  previousScreenID,
  screenOpen,
  setter
) => {
  console.log(
    "BP helper:",
    activeScreenID,
    previousScreenID,
    screenOpen,
    setter
  );
  if (screenOpen && activeScreenID === previousScreenID) {
    setter(false);
  } else if (screenOpen && activeScreenID !== previousScreenID) {
    setter(true);
  } else {
    setter(true);
    setTimeout(() => {
      setter(true);
    }, 250);
  }
};
