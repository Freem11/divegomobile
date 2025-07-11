import { createContext, useState } from "react";

export const ActiveConfirmationIDContext = createContext("");

const ActiveConfirmationIDContextProvider = ({children}) => {
  const [activeConfirmationID, setActiveConfirmationID] = useState(null);

  return (
    <ActiveConfirmationIDContext.Provider value={{ activeConfirmationID, setActiveConfirmationID }}>
      {children}
    </ActiveConfirmationIDContext.Provider>
  )
}

export default ActiveConfirmationIDContextProvider;