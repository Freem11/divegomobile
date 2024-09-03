import { createContext, useState } from 'react';

export const LevelOneScreenContext = createContext('');

const LevelOneScreenContextProvider = ({children}) => {
    const [levelOneScreen, setLevelOneScreen] = useState(false);

    return (
        <LevelOneScreenContext.Provider value={{ levelOneScreen, setLevelOneScreen }}>
            {children}
        </LevelOneScreenContext.Provider>
    )
}

export default LevelOneScreenContextProvider;