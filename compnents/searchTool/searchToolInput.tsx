import React from "react";

import SearchInput from "../reusables/searchInput";

import * as S from "./styles";
 
export default function SearchToolInput({ 
  iconLeft, 
  iconRight,
  searchValue, 
  handleChange, 
  handleClear 
}) {

  return (
    <S.SearchInputContainer>
      <SearchInput
        iconLeft={iconLeft}
        iconRight={iconRight}
        value={searchValue}
        onChangeText={handleChange}
        handleClear={handleClear}
      />
    </S.SearchInputContainer>
  );
};
