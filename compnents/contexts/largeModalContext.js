import { createContext, useState } from 'react';

export const LargeModalContext = createContext('');

const LargeModalContextProvider = ({children}) => {
    const [largeModal, setLargeModal] = useState(false);

    return (
        <LargeModalContext.Provider value={{ largeModal, setLargeModal }}>
            {children}
        </LargeModalContext.Provider>
    )
}

export default LargeModalContextProvider;