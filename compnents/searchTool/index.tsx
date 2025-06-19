import React from "react";
import useSearchTool from './useSearchtool';
import SearchToolInput from "./searchToolInput";
import { useTranslation } from "react-i18next";
import SearchToolList from "./searchToolList";

export default function SearchTool() {
  const {
    list,
    searchValue,
    handleChange,
    handleClear,
    handleMapOptionSelected,
    handleDiveSiteOptionSelected
  } = useSearchTool();
  
  const { t } = useTranslation();

  console.log('list',list)
  return (
    <>
    <SearchToolInput
      icon="navigation-variant-outline"
      vectorIcon="Ionicons"
      placeHolderText={t('SearchPage.placeholder')}
      searchValue={searchValue}
      handleChange={handleChange}
      handleClear={handleClear}
      />

    <SearchToolList 
      data={list} 
      handleMapOptionSelected={handleMapOptionSelected}
      handleDiveSiteOptionSelected={handleDiveSiteOptionSelected}
      />
    </>
    ); 
};
