import React from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import * as S from "./styles";
import { FeedItemComponentProps } from "./failedPicUpload";
import { FailedSyncFeedItem } from "../../../store/types";

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
        <S.IconWrapper onPress={() => onRemove(item.id)}>
          <AntDesign name="delete" size={20} color="red" />
        </S.IconWrapper>
      </S.ActionsRow>
    </S.Card>
  );
}
