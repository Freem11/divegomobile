import { createContext, useState } from "react";

export const ShopContext = createContext("");

const ShopContextProvider = ({children}) => {
  const [shop, setShop] = useState(false);

  return (
    <ShopContext.Provider value={{ shop, setShop }}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider;