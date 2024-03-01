import { createContext, useState } from 'react';

export const PictureContext = createContext('');

const PictureContextProvider = ({children}) => {
    const [uploadedFile, setUploadedFile] = useState(null);

    return (
        <PictureContext.Provider value={{ uploadedFile, setUploadedFile }}>
            {children}
        </PictureContext.Provider>
    )
}

export default PictureContextProvider;