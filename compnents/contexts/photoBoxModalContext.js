import { createContext, useState } from 'react';

export const PhotoBoxModalContext = createContext('');

const PhotoBoxModalContextProvider = ({children}) => {
    const [photoBoxModal, setPhotoBoxModal] = useState(false);

    return (
        <PhotoBoxModalContext.Provider value={{ photoBoxModal, setPhotoBoxModal }}>
            {children}
        </PhotoBoxModalContext.Provider>
    )
}

export default PhotoBoxModalContextProvider;