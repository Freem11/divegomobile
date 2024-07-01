import { createContext, useState } from 'react';

export const ActiveButtonIDContext = createContext('');

const ActiveButtonIDContextProvider = ({children}) => {
    const [activeButtonID, setActiveButtonID] = useState(null);

    return (
        <ActiveButtonIDContext.Provider value={{ activeButtonID, setActiveButtonID }}>
            {children}
        </ActiveButtonIDContext.Provider>
    )
}

export default ActiveButtonIDContextProvider;