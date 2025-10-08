import React from "react";
import * as S from "./styles";
import { FeedItemComponentProps } from "./failedPicUpload";
import { Notification, PhotoLikeFeedItem } from "../../../store/types";
import ButtonIcon from "../../../../reusables/buttonIcon";
import { colors } from "../../../../styles";
import { View } from "react-native";

type Props = { item: Notification };

export default function FeedItemPhotoLike({ item }: Props) {

  const username = item?.sender?.username ?? "Unknown user";

  return (
    <S.Card bg="#FFFBEA">
      {/* <S.Message>{item.title}</S.Message> */}
      <S.Message>{`${username} liked your photo`}</S.Message>
      <S.ActionsRow>

        {/* {item.action && (
          <ButtonIcon
            icon="eye"
            onPress={item.action}
            size="headerIcon"
            fillColor={colors.themeBlack}
          />
        )} */}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {/* <ButtonIcon
            icon="trash"
            onPress={() => onRemove(item.id)}
            size="headerIcon"
            fillColor={colors.themeRed}
          /> */}
        </View>

      </S.ActionsRow>
    </S.Card>
  );
}