
import React from "react";
import { FailedUploadFeedItem, FeedItem } from "../../../store/useFeedDataStore";
import * as S from "./styles";

export type FeedItemComponentProps = {
  item: FeedItem;
  onRemove: (id: string) => void;
};

export default function FeedItemFailedUpload({
  item,
  onRemove,
}: FeedItemComponentProps & { item: FailedUploadFeedItem }) {
  
  return (
    <S.Card>
      <S.Message>{item.title}</S.Message>
      <S.ImagePreview source={{ uri: item.imageUri }} resizeMode="cover" />
      <S.Timestamp>{item.message}</S.Timestamp>
      <S.ActionsRow>
        <S.ActionText onPress={item.retryCallback}>Retry</S.ActionText>
        <S.RemoveText onPress={() => onRemove(item.id)}>Remove</S.RemoveText>
      </S.ActionsRow>
    </S.Card>
  );
}
