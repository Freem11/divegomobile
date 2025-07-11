import { createContext, useState } from "react";
import { Dimensions } from "react-native";

export const SavedTranslateYContext = createContext("");

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");
const HALF_HEIGHT = SCREEN_HEIGHT / 2;

const SavedTranslateYContextProvider = ({children}) => {
  const [savedTranslateY, setSavedTranslateY] = useState(HALF_HEIGHT);

  return (
    <SavedTranslateYContext.Provider value={{ savedTranslateY, setSavedTranslateY }}>
      {children}
    </SavedTranslateYContext.Provider>
  )
}

export default SavedTranslateYContextProvider;