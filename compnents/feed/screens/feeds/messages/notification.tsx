import React from "react";
import * as S from "./styles";
import { FeedItemComponentProps } from "./failedPicUpload";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NotificationFeedItem } from "../../../store/types";

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
          <S.IconWrapper onPress={item.action}>
            <FontAwesome name="folder-open-o" size={24} color="black" />
          </S.IconWrapper>
        )}
        <S.IconWrapper onPress={() => onRemove(item.id)}>
          <AntDesign name="delete" size={20} color="red" />
        </S.IconWrapper>
      </S.ActionsRow>
    </S.Card>
  );
}
