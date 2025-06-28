import React, { createContext, useState } from 'react';

type LevelOneScreenContexttype = {
  levelOneScreen: boolean
  setLevelOneScreen: React.Dispatch<React.SetStateAction<boolean>>
};

export const LevelOneScreenContext = createContext<LevelOneScreenContexttype>({} as LevelOneScreenContexttype);

const LevelOneScreenContextProvider = ({ children }: any) => {
  const [levelOneScreen, setLevelOneScreen] = useState(false);

  return (
    <LevelOneScreenContext.Provider value={{ levelOneScreen, setLevelOneScreen }}>
      {children}
    </LevelOneScreenContext.Provider>
  );
};

export default LevelOneScreenContextProvider;
