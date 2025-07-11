import { createContext, useState } from "react";

export const EditModeContext = createContext("");

const EditModeContextProvider = ({children}) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <EditModeContext.Provider value={{ editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  )
}

export default EditModeContextProvider;