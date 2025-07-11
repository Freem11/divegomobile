import { createContext, useState } from "react";

export const ConfirmationModalContext = createContext("");

const ConfirmationModalContextProvider = ({children}) => {
  const [confirmationModal, setConfirmationModal] = useState(false);

  return (
    <ConfirmationModalContext.Provider value={{ confirmationModal, setConfirmationModal }}>
      {children}
    </ConfirmationModalContext.Provider>
  )
}

export default ConfirmationModalContextProvider;