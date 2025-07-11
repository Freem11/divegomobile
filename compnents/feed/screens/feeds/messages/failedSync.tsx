import React from "react";

import { FailedSyncFeedItem } from "../../../store/types";
import ButtonIcon from "../../../../reusables/buttonIcon";
import { colors } from "../../../../styles";

import { FeedItemComponentProps } from "./failedPicUpload";
import * as S from "./styles";

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
