import { createContext, useState } from "react";

export const AnchorPhotosContext = createContext("");

const AnchorPhotosContextProvider = ({ children }) => {
  const [anchPhotos, setAnchPhotos] = useState(null);

  return (
    <AnchorPhotosContext.Provider value={{ anchPhotos, setAnchPhotos }}>
      {children}
    </AnchorPhotosContext.Provider>
  );
};

export default AnchorPhotosContextProvider;