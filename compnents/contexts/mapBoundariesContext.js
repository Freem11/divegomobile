import { createContext, useState } from 'react';

export const MapBoundariesContext = createContext('');

const MapBoundariesContextProvider = ({children}) => {
    const [boundaries, setBoundaries] = useState([]);

    return (
        <MapBoundariesContext.Provider value={{ boundaries, setBoundaries }}>
            {children}
        </MapBoundariesContext.Provider>
    )
}

export default MapBoundariesContextProvider;