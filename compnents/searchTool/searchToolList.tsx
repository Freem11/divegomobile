import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import SearchToolListItem from './searchToolListItem';
import { colors } from '../styles';

export default function SearchToolList({
  data,
  handleMapOptionSelected,
  handleDiveSiteOptionSelected,
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
  },
});