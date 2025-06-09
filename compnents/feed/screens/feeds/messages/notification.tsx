import React from "react";
import * as S from "./styles";
import { FeedItemComponentProps } from "./failedPicUpload";
import { NotificationFeedItem } from "../../../store/types";
import ButtonIcon from "../../../../reusables/buttonIcon";
import { colors } from "../../../../styles";

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
          <ButtonIcon
            icon="eye"
            onPress={item.action}
            size="small"
            fillColor={colors.themeBlack}
          />
        )}
        <ButtonIcon
          icon="trash"
          onPress={() => onRemove(item.id)}
          size="small"
          fillColor={colors.themeRed}
        />
      </S.ActionsRow>
    </S.Card>
  );
}
