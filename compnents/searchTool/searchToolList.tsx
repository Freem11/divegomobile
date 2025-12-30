import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../styles";

import SearchToolListItem from "./searchToolListItem";

export default function SearchToolList({
  data,
  handleMapOptionSelected,
  handleDiveSiteOptionSelected,
  handleSeaLifeOptionSelected,
  setSearchStatus,
}) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // We manually track the keyboard height
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (!data || data.length === 0) return null;

  const BOTTOM_BAR_HEIGHT = moderateScale(120);

  const totalBottomPadding = keyboardHeight > 0
    ? moderateScale(80)
    : insets.bottom + BOTTOM_BAR_HEIGHT;

  return (
    <View
      style={[
        styles.masterContainer,
        { marginBottom: keyboardHeight }
      ]}
    >
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          extraData={keyboardHeight}
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
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.themeWhite,
    paddingTop: Platform.OS === "ios" ? moderateScale(5) : moderateScale(60),
  },
});