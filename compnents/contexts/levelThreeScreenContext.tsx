import React, { createContext, useState } from 'react';

type LevelThreeScreenContexttype = {
  levelThreeScreen: boolean
  setLevelThreeScreen: React.Dispatch<React.SetStateAction<boolean>>
};

export const LevelThreeScreenContext = createContext<LevelThreeScreenContexttype>({} as LevelThreeScreenContexttype);

const LevelThreeScreenContextProvider = ({ children }: any) => {
  const [levelThreeScreen, setLevelThreeScreen] = useState(false);

  return (
    <LevelThreeScreenContext.Provider value={{ levelThreeScreen, setLevelThreeScreen }}>
      {children}
    </LevelThreeScreenContext.Provider>
  );
};

export default LevelThreeScreenContextProvider;
