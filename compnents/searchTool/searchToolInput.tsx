import React from "react";
import * as S from "./styles";
import SearchInput from "../reusables/searchInput";
 
export default function SearchToolInput({ 
  iconLeft, 
  iconRight,
  searchValue, 
  handleChange, 
  handleClear,
  handleFocus
  }) {

  return (
    <S.SearchInputContainer>
        <SearchInput
          iconLeft={iconLeft}
          iconRight={iconRight}
          value={searchValue}
          onChangeText={handleChange}
          handleClear={handleClear}
          onFocus={handleFocus}
        />
    </S.SearchInputContainer>
  );
};
