import { createContext, useState } from 'react';

export const SmallModalContext = createContext('');

const SmallModalContextProvider = ({children}) => {
    const [smallModal, setSmallModal] = useState(false);

    return (
        <SmallModalContext.Provider value={{ smallModal, setSmallModal }}>
            {children}
        </SmallModalContext.Provider>
    )
}

export default SmallModalContextProvider;