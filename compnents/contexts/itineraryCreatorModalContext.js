import { createContext, useState } from 'react';

export const ItineraryCreatorModalContext = createContext('');

const ItineraryCreatorModalContextProvider = ({children}) => {
    const [itineraryCreatorModal, setItineraryCreatorModal] = useState(false);

    return (
        <ItineraryCreatorModalContext.Provider value={{ itineraryCreatorModal, setItineraryCreatorModal }}>
            {children}
        </ItineraryCreatorModalContext.Provider>
    )
}

export default ItineraryCreatorModalContextProvider;