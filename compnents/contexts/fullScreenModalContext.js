import { createContext, useState } from 'react';

export const FullScreenModalContext = createContext('');

const FullScreenModalContextProvider = ({children}) => {
    const [fullScreenModal, setFullScreenModal] = useState(false);

    return (
        <FullScreenModalContext.Provider value={{ fullScreenModal, setFullScreenModal }}>
            {children}
        </FullScreenModalContext.Provider>
    )
}

export default FullScreenModalContextProvider;