export const useButtonPressHelper = (
  activeButtonID,
  previousButtonID,
  modal,
  setter
) => {
  console.log(modal, activeButtonID, previousButtonID, setter)
  if (modal && (activeButtonID === previousButtonID)) {
    console.log("here? 1")
    setter(false);
  } else if (modal && (activeButtonID !== previousButtonID)) {
    console.log("here? 2")
    setter(true);
  } else {
    console.log("here? 3")
    setter(true);
    setTimeout(() => {
      setter(true);
    }, 250);
    
  }
};
