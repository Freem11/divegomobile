import React, { createContext, useState } from "react";

type LevelTwoScreenContexttype = {
  levelTwoScreen: boolean
  setLevelTwoScreen: React.Dispatch<React.SetStateAction<boolean>>
};

export const LevelTwoScreenContext = createContext<LevelTwoScreenContexttype>({} as LevelTwoScreenContexttype);

const LevelTwoScreenContextProvider = ({ children }: any) => {
  const [levelTwoScreen, setLevelTwoScreen] = useState(false);

  return (
    <LevelTwoScreenContext.Provider value={{ levelTwoScreen, setLevelTwoScreen }}>
      {children}
    </LevelTwoScreenContext.Provider>
  );
};

export default LevelTwoScreenContextProvider;
