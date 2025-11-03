import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  RefreshControl,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import { activeFonts, colors } from "../../../styles";
import { useFeedScreenStore } from "../../store/useScreenStore";
import ButtonIcon from "../../../reusables/buttonIcon";
import * as S from "./styles";

import { useNotificationsStore } from "../../store/useNotificationsStore";
import FeedItemPhotoLike from "./messages/photoLike";
import FeedItemPhotoComment from "./messages/photoComment";
import type { Notification } from "../../store/types";

const windowHeight = Dimensions.get("window").height;

export default function FeedList() {
  const { t } = useTranslation();
  const closeScreen = useFeedScreenStore((s) => s.closeScreen);

  const list = useNotificationsStore((s) => s.list);
  const loadMore = useNotificationsStore((s) => s.loadMore);
  const loadFirst = useNotificationsStore((s) => s.loadFirst);
  const markAllSeen = useNotificationsStore((s) => s.markAllSeen);
  const markOneSeen = useNotificationsStore((s) => s.markOneSeen);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFirst();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFirst();
    setRefreshing(false);
  };

  const onUsernamePress = (n: Notification) => {
    // openUserProfile(n.sender?.user_id);
    if (!n.is_seen) {
      markOneSeen(n.id);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const code = item.notification_types?.code;
    switch (code) {
      case "photo_like":
        return <FeedItemPhotoLike item={item} onUsernamePress={onUsernamePress}/>;
      case "photo_comment":
        return <FeedItemPhotoComment item={item} onUsernamePress={onUsernamePress}/>;
      default:
        return null;
    }
  };

  return (
    <S.SafeArea style={styles.container}>
      <View style={styles.headerRow}>
        <ButtonIcon
          icon="chevron-left"
          onPress={closeScreen}
          size="small"
          fillColor={colors.neutralGrey}
        />
        <Text style={styles.title}>Your Notifications</Text>
      </View>
      {!list.items || list.items.length === 0 ? (
        list.isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.emptyMessage}>{t("Feed.noFeeds")}</Text>
        )
      ) : (
        <FlatList
          data={list.items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          onEndReachedThreshold={0.3}
          onEndReached={loadMore}
          ItemSeparatorComponent={() => <View style={{ height: moderateScale(12) }} />}
          ListFooterComponent={
            list.isLoading ? (
              <View style={{ padding: moderateScale(12) }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    paddingBottom: moderateScale(12),
    paddingTop: Platform.OS === "ios" ? moderateScale(15) : moderateScale(10),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
    marginVertical: moderateScale(8),
  },
  emptyMessage: {
    fontSize: moderateScale(16),
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
  },
});
