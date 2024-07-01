import { createContext, useState } from 'react';

export const ItineraryListModalContext = createContext('');

const ItineraryListModalContextProvider = ({children}) => {
    const [itineraryListModal, setItineraryListModal] = useState(false);

    return (
        <ItineraryListModalContext.Provider value={{ itineraryListModal, setItineraryListModal }}>
            {children}
        </ItineraryListModalContext.Provider>
    )
}

export default ItineraryListModalContextProvider;