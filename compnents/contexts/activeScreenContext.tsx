import React, { createContext, useState } from 'react';

type ActiveScreenContextType = {
  activeScreen:    {screen: string, params: {}} | null
  setActiveScreen: React.Dispatch<React.SetStateAction< {screen: string, params: {}} | null>>
};

export const ActiveScreenContext = createContext<ActiveScreenContextType>({} as ActiveScreenContextType);

const ActiveScreenContextProvider = ({ children }: any) => {
  const [activeScreen, setActiveScreen] = useState< {screen: string, params: {}} | null>(null);

  return (
    <ActiveScreenContext.Provider value={{ activeScreen, setActiveScreen }}>
      {children}
    </ActiveScreenContext.Provider>
  );
};

export default ActiveScreenContextProvider;
