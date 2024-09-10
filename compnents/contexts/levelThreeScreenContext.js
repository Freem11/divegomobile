import { createContext, useState } from 'react';

export const LevelThreeScreenContext = createContext('');

const LevelThreeScreenContextProvider = ({children}) => {
    const [levelThreeScreen, setLevelThreeScreen] = useState(false);

    return (
        <LevelThreeScreenContext.Provider value={{ levelThreeScreen, setLevelThreeScreen }}>
            {children}
        </LevelThreeScreenContext.Provider>
    )
}

export default LevelThreeScreenContextProvider;