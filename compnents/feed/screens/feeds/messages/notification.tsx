import React from "react";
import { View } from "react-native";

import { NotificationFeedItem } from "../../../store/types";
import ButtonIcon from "../../../../reusables/buttonIcon";
import { colors } from "../../../../styles";

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
          <ButtonIcon
            icon="eye"
            onPress={item.action}
            size="headerIcon"
            fillColor={colors.themeBlack}
          />
        )}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <ButtonIcon
            icon="trash"
            onPress={() => onRemove(item.id)}
            size="headerIcon"
            fillColor={colors.themeRed}
          />
        </View>

      </S.ActionsRow>
    </S.Card>
  );
}
