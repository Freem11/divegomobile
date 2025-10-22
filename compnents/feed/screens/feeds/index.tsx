import React, { useEffect, useContext } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import { useFeedDataStore } from "../../store/useFeedDataStore";
import { activeFonts, colors } from "../../../styles";
import { useFeedScreenStore } from "../../store/useScreenStore";
import { NotificationsFeedContext } from "../../../contexts/notificationsFeedContext";
import FeedItemFailedUpload from "./messages/failedPicUpload";
import FeedItemFailedSync from "./messages/failedSync";
import FeedItemNotification from "./messages/notification";
import { useTranslation } from "react-i18next";
import { FEED_ITEM_TYPE, FeedItem, Notification } from "../../store/types";
import ButtonIcon from "../../../reusables/buttonIcon";
import { FEED_ITEM_TYPE, FeedItem } from "../../store/types";
import ButtonIcon from "../../../reusables/buttonIcon";

import FeedItemFailedUpload from "./messages/failedPicUpload";
import FeedItemFailedSync from "./messages/failedSync";
import FeedItemNotification from "./messages/notification";
import * as S from "./styles";
import FeedItemPhotoLike from "./messages/photoLike";
import FeedItemPhotoComment from "./messages/photoComment";

const windowHeight = Dimensions.get("window").height;

export default function FeedList() {
  const { t } = useTranslation();
  // const feedItems = useFeedDataStore((state) => state.feedItems);
  const loadFeedItems = useFeedDataStore((state) => state.loadFeedItems);
  const removeFeedItem = useFeedDataStore((state) => state.removeFeedItem);
  const clearFeedItems = useFeedDataStore((state) => state.clearFeedItems);
  const closeScreen = useFeedScreenStore((state) => state.closeScreen);
  const { notifications, setNotifications } = useContext(
    NotificationsFeedContext
  );

  useEffect(() => {
    loadFeedItems();
  }, []);

  // const renderItem = ({ item }: { item: FeedItem }) => {
  //   switch (item.type) {
  //     case FEED_ITEM_TYPE.FAILED_UPLOAD:
  //       return <FeedItemFailedUpload item={item} onRemove={removeFeedItem} />;
  //     case FEED_ITEM_TYPE.FAILED_SYNC:
  //       return <FeedItemFailedSync item={item} onRemove={removeFeedItem} />;
  //     case FEED_ITEM_TYPE.NOTIFICATION:
  //       return <FeedItemNotification item={item} onRemove={removeFeedItem} />;
  //     default:
  //       return null;
  //   }
  // };

  const renderItem = ({ item }: { item: Notification }) => {
    console.log("Rendering notification item:", item);
    switch (item.notification_types.code) {
      case "photo_like":
        return (
          <FeedItemPhotoLike item={item} />
        );
      case "photo_comment":
        return (
          <FeedItemPhotoComment item={item} />
        );
  const renderItem = ({ item }: { item: FeedItem }) => {
    switch (item.type) {
      case FEED_ITEM_TYPE.FAILED_UPLOAD:
        return <FeedItemFailedUpload item={item} onRemove={removeFeedItem} />;
      case FEED_ITEM_TYPE.FAILED_SYNC:
        return <FeedItemFailedSync item={item} onRemove={removeFeedItem} />;
      case FEED_ITEM_TYPE.NOTIFICATION:
        return <FeedItemNotification item={item} onRemove={removeFeedItem} />;
      default:
        return null;
    }
  };

  return (
    <S.SafeArea>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <ButtonIcon
          icon="chevron-left"
          onPress={() => closeScreen()}
          size="small"
          fillColor={colors.neutralGrey}
        />
        <ButtonIcon
          icon="trash"
          onPress={() => clearFeedItems()}
          size="headerIcon"
          fillColor={colors.themeRed}
        />
      </View>
      <S.Header>Your Notifications</S.Header>

      {notifications.length === 0 ? (
      {feedItems.length === 0 ? (
        <Text style={styles.emptyMessage}>{t("Feed.noFeeds")}</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      )}
    </S.SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.themeWhite,
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(100),
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
    display: "flex",
    gap: moderateScale(12),
  },
});
