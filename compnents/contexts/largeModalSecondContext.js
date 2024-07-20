import { createContext, useState } from 'react';

export const LargeModalSecondContext = createContext('');

const LargeModalSecondContextProvider = ({children}) => {
    const [largeModalSecond, setLargeModalSecond] = useState(false);

    return (
        <LargeModalSecondContext.Provider value={{ largeModalSecond, setLargeModalSecond }}>
            {children}
        </LargeModalSecondContext.Provider>
    )
}

export default LargeModalSecondContextProvider;