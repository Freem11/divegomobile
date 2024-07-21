export const useButtonPressHelper = (
  activeButtonID,
  previousButtonID,
  modal,
  setter
) => {
  console.log(modal, activeButtonID, previousButtonID, setter)
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
