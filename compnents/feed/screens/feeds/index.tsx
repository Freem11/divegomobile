import React, { useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFeedDataStore } from "../../store/useFeedDataStore";
import { moderateScale } from "react-native-size-matters";
import { activeFonts, colors } from "../../../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useFeedScreenStore } from "../../store/useScreenStore";

const windowHeight = Dimensions.get("window").height;

export default function FeedList() {
  const { feedItems, loadFeedItems } = useFeedDataStore();
  const closeScreen = useFeedScreenStore((state) => state.closeScreen);
  useEffect(() => {
    loadFeedItems();
  }, []);

  console.log("FeedList", feedItems);

  return (
    <SafeAreaView style={styles.container}>
         <MaterialIcons
              name="chevron-left"
              size={moderateScale(48)}
              color={colors.themeWhite}
              onPress={() => closeScreen()}
              style={styles.backButton}
            />
      {feedItems.length === 0 ? (
        <Text style={styles.emptyMessage}>No feed items yet.</Text>
      ) : (
        <FlatList
          data={feedItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.themeWhite,
    paddingHorizontal: moderateScale(16),
    height: windowHeight,
    paddingTop: Platform.OS === "ios" ? moderateScale(15) : moderateScale(10),
  },
  emptyMessage: {
    fontSize: moderateScale(16),
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
  },
  listContainer: {
    width: "100%",
  },
  card: {
    width: "100%",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: moderateScale(15),
    marginBottom: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  message: {
    fontSize: moderateScale(14),
    color: colors.themeBlack,
    fontFamily: activeFonts.Regular,
  },
  backButton: {
    display: "flex",
    alignSelf: "flex-start",
    backgroundColor: colors.themeBlack,
  },
  timestamp: {
    fontSize: moderateScale(12),
    color: "gray",
    marginTop: moderateScale(4),
    fontFamily: activeFonts.ThinItalic,
  },

});
