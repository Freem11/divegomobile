import { createContext, useState } from 'react';

export const PictureAdderContext = createContext('');

const PictureAdderContextProvider = ({children}) => {
    const [picAdderModal, setPicAdderModal] = useState(false);

    return (
        <PictureAdderContext.Provider value={{ picAdderModal, setPicAdderModal }}>
            {children}
        </PictureAdderContext.Provider>
    )
}

export default PictureAdderContextProvider;