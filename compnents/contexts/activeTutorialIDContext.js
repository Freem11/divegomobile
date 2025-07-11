import { createContext, useState } from "react";

export const ActiveTutorialIDContext = createContext("");

const ActiveTutorialIDContextProvider = ({children}) => {
  const [activeTutorialID, setActiveTutorialID] = useState(null);

  return (
    <ActiveTutorialIDContext.Provider value={{ activeTutorialID, setActiveTutorialID }}>
      {children}
    </ActiveTutorialIDContext.Provider>
  )
}

export default ActiveTutorialIDContextProvider;