import { createContext, useState } from 'react';

export const DSAdderContext = createContext('');

const DSAdderContextProvider = ({children}) => {
    const [diveSiteAdderModal, setDiveSiteAdderModal] = useState(false);

    return (
        <DSAdderContext.Provider value={{ diveSiteAdderModal, setDiveSiteAdderModal }}>
            {children}
        </DSAdderContext.Provider>
    )
}

export default DSAdderContextProvider;