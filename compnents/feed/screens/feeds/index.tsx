import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import { activeFonts, colors } from "../../../styles";
import { useFeedScreenStore } from "../../store/useScreenStore";
import ButtonIcon from "../../../reusables/buttonIcon";
import * as S from "./styles";
import { useAppNavigation } from "../../../mapPage/types";

import { useNotificationsStore } from "../../store/useNotificationsStore";
import FeedItemPhotoLike from "./messages/photoLike";
import FeedItemPhotoComment from "./messages/photoComment";
import type { Notification } from "../../store/types";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { SelectedPhotoContext } from "../../../contexts/selectedPhotoContext";

const windowHeight = Dimensions.get("window").height;

export default function FeedList() {
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const closeScreen = useFeedScreenStore((s) => s.closeScreen);

  const list = useNotificationsStore((s) => s.list);
  const loadMore = useNotificationsStore((s) => s.loadMore);
  const loadFirst = useNotificationsStore((s) => s.loadFirst);
  const markOneSeen = useNotificationsStore((s) => s.markOneSeen);
  const newCount = useNotificationsStore((s) => s.count);

  const [activeTab, setActiveTab] = useState<"new" | "old">("new");
  const items = list.items ?? [];
  const newItems = items.filter((n) => !n.is_seen);
  const oldItems = items.filter((n) => n.is_seen);

  const data = activeTab === "new" ? newItems : oldItems;
  const { setSelectedPhoto } = useContext(SelectedPhotoContext);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFirst();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFirst();
    setRefreshing(false);
  };

  const togglePhotoBoxModal = (n: Notification, type: "photo_like" | "photo_comment") => {
    const photoFile =type === "photo_like"
      ? n.notification_photo_like?.photo?.photoFile
      : n.notification_photo_comment?.photo?.photoFile;

    if (!photoFile) {
      console.warn("No photoFile found for notification", { type, n });
      return;
    }
    setSelectedPhoto(photoFile);
    navigation.navigate("PinchAndZoomPhoto");
  };

  const setActiveScreen = useActiveScreenStore(
    (state) => state.setActiveScreen
  );

  // const goToUserProfile = (n: Notification) => {
  //   navigation.navigate("Profile", { id: n.sender.id });
  // };

    const goToUserProfile = async (user_id: string) => {
      // const picOwnerAccount = await grabProfileByUserName(userName);
  
      // if (userProfile.UserID === picOwnerAccount[0].UserID) {
      //   return;
      // }
  
      navigation.navigate("BottomTab", {
        screen: "Profile",
        params: { id: user_id },
      });
    };

  const onTrashPress = (n: Notification) => {
    if (!n.is_seen) {
      markOneSeen(n.id);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const code = item.notification_types?.code;
    switch (code) {
      case "photo_like":
        return (
          <FeedItemPhotoLike
            item={item}
            onUsernamePress={() =>goToUserProfile(item.sender.user_id)}
            onPhotoPress={(n) => togglePhotoBoxModal(n, "photo_like")}
            onTrashPress={onTrashPress}
          />
        );
      case "photo_comment":
        return (
          <FeedItemPhotoComment
            item={item}
            onUsernamePress={() => goToUserProfile(item.sender.user_id)}
            onPhotoPress={() => navigation.navigate("PhotoComments", { id: item.notification_photo_comment?.photo?.id, userId: item.sender.user_id })}
            onTrashPress={onTrashPress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <S.SafeArea style={styles.container}>
      <View style={styles.headerRow}>
        <ButtonIcon
          icon="chevron-left"
          onPress={() => navigation.goBack()}
          size='small'
          fillColor={colors.neutralGrey}
        />
      </View>
      <View style={styles.secondHeaderRow}>
        <Text style={styles.title}>Your Notifications</Text>
      </View>
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "new" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("new")}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "new" && styles.tabLabelActive,
            ]}
          >
            New ({newCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "old" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("old")}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "old" && styles.tabLabelActive,
            ]}
          >
            Old
          </Text>
        </TouchableOpacity>
      </View>
      {(!list.items || list.items.length === 0) && list.isLoading ? (
        <ActivityIndicator />
      ) : (!list.items || list.items.length === 0) && !list.isLoading ? (
        <Text style={styles.emptyMessage}>{t("Feed.noNotifications")}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          onEndReachedThreshold={0.3}
          onEndReached={loadMore}
          ItemSeparatorComponent={() => (
            <View style={{ height: moderateScale(12) }} />
          )}
          ListFooterComponent={
            list.isLoading ? (
              <View style={{ padding: moderateScale(12) }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !list.isLoading ? (
              <Text style={styles.emptyMessage}>
                {activeTab === "new"
                  ? "No new notifications"
                  : "No old notifications"}
              </Text>
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
    paddingBottom: moderateScale(16),
    paddingTop: Platform.OS === "ios" ? moderateScale(15) : moderateScale(10),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  secondHeaderRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: activeFonts.Bold,
    color: colors.headersBlue,
    marginVertical: moderateScale(8),
  },
  emptyMessage: {
    fontSize: moderateScale(16),
    fontFamily: activeFonts.Medium,
    color: colors.themeBlack,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: moderateScale(16),
    gap: moderateScale(12),
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(14),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.themeWhite,
  },
  tabActive: {
    backgroundColor: colors.headersBlue,
    borderColor: colors.headersBlue,
  },
  tabLabel: {
    fontSize: moderateScale(14),
    fontFamily: activeFonts.Medium,
    color: colors.headersBlue,
  },
  tabLabelActive: {
    color: colors.themeWhite,
  },
});
