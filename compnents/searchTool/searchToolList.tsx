import React from "react";
import { FlatList } from "react-native-gesture-handler";
import SearchToolListItem from "./searchToolListItem";

export default function SearchToolList({ data, handleMapOptionSelected, handleDiveSiteOptionSelected }) {

  console.log('data', data)
  return (
    <FlatList
    keyExtractor={(item) => item.id}
    scrollEnabled={true}
    data={data}
    renderItem={({ item }) => (
        <SearchToolListItem 
          name={item.title} 
          soureImage={item.source} 
          handleMapOptionSelected={handleMapOptionSelected}
          handleDiveSiteOptionSelected={handleDiveSiteOptionSelected}
          />
    )}
    />
  );
};
   