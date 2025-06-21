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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useFeedScreenStore } from "../../store/useScreenStore";
import FeedItemFailedUpload from "./messages/failedPicUpload";
import FeedItemFailedSync from "./messages/failedSync";
import FeedItemNotification from "./messages/notification";
import { useTranslation } from "react-i18next";
import { FEED_ITEM_TYPE, FeedItem } from "../../store/types";
import ButtonIcon from "../../../reusables/buttonIcon";
import * as S from "./styles";

const windowHeight = Dimensions.get("window").height;

export default function FeedList() {
  const { t } = useTranslation();
  const feedItems = useFeedDataStore((state) => state.feedItems);
  const loadFeedItems = useFeedDataStore((state) => state.loadFeedItems);
  const removeFeedItem = useFeedDataStore((state) => state.removeFeedItem);
  const clearFeedItems = useFeedDataStore((state) => state.clearFeedItems);
  const closeScreen = useFeedScreenStore((state) => state.closeScreen);

  useEffect(() => {
    loadFeedItems();
  }, []);


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
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <ButtonIcon 
          icon="chevron-left"
          onPress={() => closeScreen()}
          size='small'
          fillColor={colors.themeBlack}
        />
        <ButtonIcon 
          icon="trash"
          onPress={() => clearFeedItems()}
          size='small'
          fillColor={colors.themeRed}
        />
      </View>
      
      {feedItems.length === 0 ? (
        <Text style={styles.emptyMessage}>{t('Feed.noFeeds')}</Text>
      ) : (
        <FlatList
          data={feedItems}
          keyExtractor={(item) => item.id}
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
