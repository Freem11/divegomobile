import React from "react";
import { NotificationFeedItem } from "../../../store/useFeedDataStore";
import * as S from "./styles";
import { FeedItemComponentProps } from "./failedPicUpload";

export default function FeedItemNotification({
  item,
  onRemove,
}: FeedItemComponentProps & { item: NotificationFeedItem }) {
  return (
    <S.Card bg="#FFFBEA">
      <S.Message>{item.title}</S.Message>
      <S.Timestamp>{item.message}</S.Timestamp>
      <S.ActionsRow>
        {item.action && (
          <S.PrimaryText onPress={item.action}>Open</S.PrimaryText>
        )}
        <S.RemoveText onPress={() => onRemove(item.id)}>Dismiss</S.RemoveText>
      </S.ActionsRow>
    </S.Card>
  );
}
