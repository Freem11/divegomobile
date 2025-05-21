import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FailedUploadFeedItem, FeedItem } from "../../../store/useFeedDataStore";
import { activeFonts, colors } from "../../../../styles";

export type FeedItemComponentProps = {
  item: FeedItem;
  onRemove: (id: string) => void;
};

export default function FeedItemFailedUpload({
  item,
  onRemove,
}: FeedItemComponentProps & { item: FailedUploadFeedItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{item.title}</Text>
      <Image source={{ uri: item.imageUri }} style={styles.imagePreview} />
      <Text style={styles.timestamp}>{item.message}</Text>
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
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: moderateScale(15),
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
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginVertical: moderateScale(8),
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
