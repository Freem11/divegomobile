import { createContext, useState } from 'react';

export const TripDetailContext = createContext('');

const TripDetailContextProvider = ({children}) => {
    const [formValues, setFormValues] = useState({
        BookingLink: "",
        TripName: "",
        StartDate: "",
        EndDate: "",
        Price: 0,
        TripDesc: "",
        DiveSites: [],
        ShopId: null
      });

    return (
        <TripDetailContext.Provider value={{ formValues, setFormValues }}>
            {children}
        </TripDetailContext.Provider>
    )
}

export default TripDetailContextProvider;
