import { createContext, useState } from "react";

export const AnimalSelectContext = createContext("");

const AnimalSelectContextProvider = ({children}) => {
  const [animalSelection, setAnimalSelection] = useState("");

  return (
    <AnimalSelectContext.Provider value={{ animalSelection, setAnimalSelection }}>
      {children}
    </AnimalSelectContext.Provider>
  )
}

export default AnimalSelectContextProvider;