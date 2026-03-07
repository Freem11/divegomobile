import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Platform,
  Keyboard,
  StatusBar
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SearchToolListItem from "./searchToolListItem";

export default function SearchToolList({ data, handleMapOptionSelected, handleDiveSiteOptionSelected, handleSeaLifeOptionSelected, setSearchStatus, ...props }) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const topInset = Platform.select({
    ios: insets.top + moderateScale(65),
    android: (StatusBar.currentHeight || 0) + moderateScale(70),
  });

  useEffect(() => {
    const show = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hide = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const sub1 = Keyboard.addListener(show, (e) => {
      const height = Platform.OS === "ios"
        ? e.endCoordinates.height - insets.bottom
        : e.endCoordinates.height;
      setKeyboardHeight(height);
    });

    const sub2 = Keyboard.addListener(hide, () => setKeyboardHeight(0));

    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, [insets.bottom]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        removeClippedSubviews={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 0,
          paddingHorizontal: moderateScale(15),
          paddingBottom: keyboardHeight > 0
            ? keyboardHeight + moderateScale(-30)
            : moderateScale(10),
        }}
        renderItem={({ item }) => (
          <SearchToolListItem
            name={item.title}
            soureImage={item.source}
            handleSeaLifeOptionSelected={handleSeaLifeOptionSelected}
            handleMapOptionSelected={handleMapOptionSelected}
            handleDiveSiteOptionSelected={handleDiveSiteOptionSelected}
            setSearchStatus={setSearchStatus}
            {...props}
          />
        )}
      />
    </View>
  );
}