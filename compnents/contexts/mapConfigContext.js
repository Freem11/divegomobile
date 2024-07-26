import { createContext, useState } from 'react';

export const MapConfigContext = createContext('');

const MapConfigContextProvider = ({children}) => {
    const [mapConfig, setMapConfig] = useState(0);

    return (
        <MapConfigContext.Provider value={{ mapConfig, setMapConfig }}>
            {children}
        </MapConfigContext.Provider>
    )
}

export default MapConfigContextProvider;