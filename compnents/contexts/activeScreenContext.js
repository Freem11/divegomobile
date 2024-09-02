import { createContext, useState } from 'react';

export const ActiveScreenContext = createContext('');

const ActiveScreenContextProvider = ({children}) => {
    const [activeScreen, setActiveScreen] = useState(null);

    return (
        <ActiveScreenContext.Provider value={{ activeScreen, setActiveScreen }}>
            {children}
        </ActiveScreenContext.Provider>
    )
}

export default ActiveScreenContextProvider;