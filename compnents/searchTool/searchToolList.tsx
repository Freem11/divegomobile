import React from 'react';
import { FlatList, View, StyleSheet, Platform } from 'react-native';
import SearchToolListItem from './searchToolListItem';
import { colors } from '../styles';
import { moderateScale } from "react-native-size-matters";

export default function SearchToolList({
  data,
  handleMapOptionSelected,
  handleDiveSiteOptionSelected,
  handleSeaLifeOptionSelected,
  setSearchStatus
}) {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchToolListItem
            name={item.title}
            soureImage={item.source}
            handleMapOptionSelected={handleMapOptionSelected}
            handleDiveSiteOptionSelected={handleDiveSiteOptionSelected}
            handleSeaLifeOptionSelected={handleSeaLifeOptionSelected}
            setSearchStatus={setSearchStatus}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: colors.themeWhite, 
    paddingTop: Platform.OS === 'ios' ? moderateScale(5) : moderateScale(30)
  },
});