import { createContext, useState } from "react";

export const TripDetailContext = createContext("");

const TripDetailContextProvider = ({children}) => {
  const [formValues, setFormValues] = useState({
    BookingPage: "",
    tripName: "",
    startDate: "",
    endDate: "",
    price: 0,
    description: "",
    siteList: [],
    shopID: null
  });

  return (
    <TripDetailContext.Provider value={{ formValues, setFormValues }}>
      {children}
    </TripDetailContext.Provider>
  )
}

export default TripDetailContextProvider;
