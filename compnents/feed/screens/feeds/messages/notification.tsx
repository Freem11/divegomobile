import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FeedItemComponentProps } from "./failedPicUpload";
import { activeFonts, colors } from "../../../../styles";
import { NotificationFeedItem } from "../../../store/useFeedDataStore";

export default function FeedItemNotification({
  item,
  onRemove,
}: FeedItemComponentProps & { item: NotificationFeedItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{item.title}</Text>
      <Text style={styles.timestamp}>{item.message}</Text>
      <View style={styles.actionsRow}>
        {item.action && (
          <TouchableOpacity onPress={item.action}>
            <Text style={styles.primary}>Open</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onRemove(item.id)}>
          <Text style={styles.remove}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFFBEA",
    borderRadius: 10,
    padding: moderateScale(15),
    marginBottom: moderateScale(12),
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
  primary: {
    color: "#4CAF50",
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
