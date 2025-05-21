import React from "react";
import { FailedSyncFeedItem } from "../../../store/useFeedDataStore";
import * as S from "./styles";
import { FeedItemComponentProps } from "./failedPicUpload";

export default function FeedItemFailedSync({
  item,
  onRemove,
}: FeedItemComponentProps & { item: FailedSyncFeedItem }) {
  return (
    <S.Card bg="#FFEDEE">
      <S.Message>{item.title}</S.Message>
      <S.Timestamp>{item.message}</S.Timestamp>
      <S.Timestamp>Reason: {item.reason}</S.Timestamp>
      <S.ActionsRow>
        <S.ActionText onPress={item.retryCallback}>Retry</S.ActionText>
        <S.RemoveText onPress={() => onRemove(item.id)}>Remove</S.RemoveText>
      </S.ActionsRow>
    </S.Card>
  );
}
