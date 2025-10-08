import React from "react";
import { View } from "react-native";
import ButtonIcon from "../../../../reusables/buttonIcon";
import { colors } from "../../../../styles";
import * as S from "./styles";
import { FeedItemComponentProps } from "./failedPicUpload";
import { PhotoCommentFeedItem } from "../../../store/types";
import { Notification, PhotoLikeFeedItem } from "../../../store/types";

type Props = { item: Notification };

export default function FeedItemPhotoComment({ item }: Props){

  const username = item?.sender?.username ?? "Unknown user";

  console.log("PhotoComment item:", item);
  return (
    <S.Card bg="#FFFBEA">
      <S.Message>{`${username} commented your photo`}</S.Message>
      {/* <S.Message>{item.title}</S.Message>
      <S.Timestamp>{item.message}</S.Timestamp>

      {!!item.comment && (
        <S.CommentBlock>
          <S.CommentText selectable>{item.comment}</S.CommentText>
        </S.CommentBlock>
      )}

      <S.ActionsRow>
        {item.action && (
          <ButtonIcon
            icon="eye"
            // onPress={item.action}
            size="headerIcon"
            fillColor={colors.themeBlack}
          />
        )}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <ButtonIcon
            icon="trash"
            // onPress={() => onRemove(item.id)}
            size="headerIcon"
            fillColor={colors.themeRed}
          />
        </View>
      </S.ActionsRow> */}
    </S.Card>
  );
}
