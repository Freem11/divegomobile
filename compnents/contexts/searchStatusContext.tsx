import React, { createContext, useState } from "react";

type SearchStatusContexttype = {
  searchStatus: boolean
  setSearchStatus: React.Dispatch<React.SetStateAction<boolean>>
};

export const SearchStatusContext = createContext<SearchStatusContexttype>({} as SearchStatusContexttype);

const SearchStatusContextProvider = ({ children }: any) => {
  const [searchStatus, setSearchStatus] = useState(false);

  return (
    <SearchStatusContext.Provider value={{ searchStatus, setSearchStatus }}>
      {children}
    </SearchStatusContext.Provider>
  );
};

export default SearchStatusContextProvider;
