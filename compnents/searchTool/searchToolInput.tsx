import React from "react";
import TextInputField from "../authentication/utils/textInput";
import * as S from "./styles";
import  MobileTextInput from '../reusables/textInput';
 
export default function SearchToolInput({ 
  icon, 
  placeHolderText, 
  vectorIcon, 
  searchValue, 
  handleChange, 
  handleClear 
  }) {

  return (
    <S.SearchInputContainer>
        <MobileTextInput
          iconLeft={icon}
          value={searchValue}
          placeholder={placeHolderText}
          onChangeText={handleChange}
        />
    </S.SearchInputContainer>
  );
};
