import { createContext, useState } from 'react';

export const PreviousButtonIDContext = createContext('');

const PreviousButtonIDContextProvider = ({children}) => {
    const [previousButtonID, setPreviousButtonID] = useState(null);

    return (
        <PreviousButtonIDContext.Provider value={{ previousButtonID, setPreviousButtonID }}>
            {children}
        </PreviousButtonIDContext.Provider>
    )
}

export default PreviousButtonIDContextProvider;