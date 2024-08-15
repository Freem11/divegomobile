export const useButtonPressHelper = (
  activeButtonID,
  previousButtonID,
  modal,
  setter
) => {
  if (modal && (activeButtonID === previousButtonID)) {
    setter(false);
  } else if (modal && (activeButtonID !== previousButtonID)) {
    setter(true);
  } else {
    setter(true);
    setTimeout(() => {
      setter(true);
    }, 250);
    
  }
};
