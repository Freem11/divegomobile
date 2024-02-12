import { createContext, useState } from 'react';

export const MasterContext = createContext('');

const MasterContextProvider = ({children}) => {
    const [masterSwitch, setMasterSwitch] = useState(true);

    return (
        <MasterContext.Provider value={{ masterSwitch, setMasterSwitch }}>
            {children}
        </MasterContext.Provider>
    )
}

export default MasterContextProvider;