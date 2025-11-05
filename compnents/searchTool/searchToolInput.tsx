import React from "react";

import SearchInput from "../reusables/searchInput";

import * as S from "./styles";

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
        autoCorrect={false}
        spellCheck={false}
      />
    </S.SearchInputContainer>
  );
};
