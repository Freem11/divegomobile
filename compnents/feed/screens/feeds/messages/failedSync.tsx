import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FeedItemComponentProps } from "./failedPicUpload";
import { FailedSyncFeedItem } from "../../../store/useFeedDataStore";
import { activeFonts, colors } from "../../../../styles";

export default function FeedItemFailedSync({
  item,
  onRemove,
}: FeedItemComponentProps & { item: FailedSyncFeedItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{item.title}</Text>
      <Text style={styles.timestamp}>{item.message}</Text>
      <Text style={styles.timestamp}>Reason: {item.reason}</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={item.retryCallback}>
          <Text style={styles.retry}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onRemove(item.id)}>
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFEDEE",
    borderRadius: 10,
    padding: moderateScale(15)
  },
  message: {
    fontSize: moderateScale(14),
    color: colors.themeBlack,
    fontFamily: activeFonts.Regular,
    marginBottom: moderateScale(4),
  },
  timestamp: {
    fontSize: moderateScale(12),
    color: "gray",
    fontFamily: activeFonts.ThinItalic,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: moderateScale(8),
  },
  retry: {
    color: "#2196F3",
    fontSize: moderateScale(14),
    fontFamily: activeFonts.Bold,
  },
  remove: {
    color: "red",
    fontSize: moderateScale(14),
    fontFamily: activeFonts.Bold,
    marginLeft: moderateScale(20),
  },
});
