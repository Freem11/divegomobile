import { createContext, useState } from 'react';

export const LevelTwoScreenContext = createContext('');

const LevelTwoScreenContextProvider = ({children}) => {
    const [levelTwoScreen, setLevelTwoScreen] = useState(false);

    return (
        <LevelTwoScreenContext.Provider value={{ levelTwoScreen, setLevelTwoScreen }}>
            {children}
        </LevelTwoScreenContext.Provider>
    )
}

export default LevelTwoScreenContextProvider;