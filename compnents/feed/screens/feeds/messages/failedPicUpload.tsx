
import React from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
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
         <S.IconWrapper onPress={item.retryCallback}>
          <AntDesign name="sync" size={24} color="green" />
        </S.IconWrapper>
         <S.IconWrapper onPress={() => onRemove(item.id)}>
          <AntDesign name="delete" size={20} color="red" />
        </S.IconWrapper>
      </S.ActionsRow>
    </S.Card>
  );
}
