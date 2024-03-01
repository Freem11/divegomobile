import { createContext, useState } from 'react';

export const MapHelperContext = createContext('');

const MapHelperContextProvider = ({children}) => {
    const [mapHelper, setMapHelper] = useState(false);

    return (
        <MapHelperContext.Provider value={{ mapHelper, setMapHelper }}>
            {children}
        </MapHelperContext.Provider>
    )
}

export default MapHelperContextProvider;