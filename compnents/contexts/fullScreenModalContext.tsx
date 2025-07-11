import React, { createContext, useState } from "react";

type FullScreenModalContextType = {
  fullScreenModal: boolean
  setFullScreenModal: React.Dispatch<React.SetStateAction<boolean>>
};

export const FullScreenModalContext = createContext<FullScreenModalContextType>({} as FullScreenModalContextType);

const FullScreenModalContextProvider = ({ children }: any) => {
  const [fullScreenModal, setFullScreenModal] = useState(false);

  return (
    <FullScreenModalContext.Provider value={{ fullScreenModal, setFullScreenModal }}>
      {children}
    </FullScreenModalContext.Provider>
  );
};

export default FullScreenModalContextProvider;
