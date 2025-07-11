import { createContext, useState } from "react";

export const ConfirmationTypeContext = createContext("");

const ConfirmationTypeContextProvider = ({children}) => {
  const [confirmationType, setConfirmationType] = useState(null);

  return (
    <ConfirmationTypeContext.Provider value={{ confirmationType, setConfirmationType }}>
      {children}
    </ConfirmationTypeContext.Provider>
  )
}

export default ConfirmationTypeContextProvider;