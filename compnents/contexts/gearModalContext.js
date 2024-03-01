import { createContext, useState } from 'react';

export const SettingsContext = createContext('');

const SettingsContextProvider = ({children}) => {
    const [gearModal, setGearModal] = useState(false);

    return (
        <SettingsContext.Provider value={{ gearModal, setGearModal }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider;