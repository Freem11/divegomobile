import React from "react";
import { FlatList, View, StyleSheet, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../styles";

import SearchToolListItem from "./searchToolListItem";

export default function SearchToolList({
  data,
  handleMapOptionSelected,
  handleDiveSiteOptionSelected,
  handleSeaLifeOptionSelected,
  setSearchStatus
}) {
  const insets = useSafeAreaInsets();

  if (!data || data.length === 0) return null;

  const BOTTOM_BAR_HEIGHT = moderateScale(120);
  const totalBottomPadding = insets.bottom + BOTTOM_BAR_HEIGHT;

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={data}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: totalBottomPadding,
        }}
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
    paddingTop: Platform.OS === "ios" ? moderateScale(5) : moderateScale(60)
  },
});