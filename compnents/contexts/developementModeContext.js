import { createContext, useState } from 'react';

export const DevelopmentModeContext = createContext('');

const DevelopmentModeContextProvider = ({children}) => {
    const [developmentMode, setDevelopmentMode] = useState(false);

    return (
        <DevelopmentModeContext.Provider value={{ developmentMode, setDevelopmentMode }}>
            {children}
        </DevelopmentModeContext.Provider>
    )
}

export default DevelopmentModeContextProvider;