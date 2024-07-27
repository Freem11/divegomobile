import { createContext, useState } from 'react';

export const PictureContext = createContext('');

const PictureContextProvider = ({children}) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    return (
        <PictureContext.Provider value={{ uploadedFiles, setUploadedFiles }}>
            {children}
        </PictureContext.Provider>
    )
}

export default PictureContextProvider;