import { createContext, useState } from 'react';

export const HeatPointsContext = createContext('');

const HeatPointsContextProvider = ({children}) => {
    const [newHeat, setNewHeat] = useState([]);

    return (
        <HeatPointsContext.Provider value={{ newHeat, setNewHeat }}>
            {children}
        </HeatPointsContext.Provider>
    )
}

export default HeatPointsContextProvider;