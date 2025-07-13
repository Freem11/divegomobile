import { createContext, useState } from 'react';

export const TripSitesContext = createContext('');

const TripSitesContextProvider = ({children}) => {
    const [tripDiveSites, setTripDiveSites] = useState([]);

    return (
        <TripSitesContext.Provider value={{ tripDiveSites, setTripDiveSites }}>
            {children}
        </TripSitesContext.Provider>
    )
}

export default TripSitesContextProvider;