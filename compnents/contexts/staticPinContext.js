import { createContext, useState } from 'react';

export const PinContext = createContext('');

const PinContextProvider = ({children}) => {
    const [pinValues, setPinValues] = useState({
        PicFile: null,
        Animal: "",
        PicDate: "",
        Latitude: "",
        Longitude: "",
        siteName: "",
        UserId: null,
      });

    return (
        <PinContext.Provider value={{ pinValues, setPinValues }}>
            {children}
        </PinContext.Provider>
    )
}

export default PinContextProvider;