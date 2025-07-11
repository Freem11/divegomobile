import { createContext, useState } from "react";

export const SelectedPhotoContext = createContext("");

const SelectedPhotoContextProvider = ({children}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <SelectedPhotoContext.Provider value={{ selectedPhoto, setSelectedPhoto }}>
      {children}
    </SelectedPhotoContext.Provider>
  )
}

export default SelectedPhotoContextProvider;