import React from "react";
import * as S from "./styles";
import { Notification } from "../../../store/types";
import {  Text } from "react-native";

type Props = {
  item: Notification;
  onUsernamePress: (n: Notification) => void;
};

export default function FeedItemPhotoLike({ item, onUsernamePress }: Props) {

  const username = item?.sender?.username ?? "Unknown user";

  return (
    <S.Card bg={item.is_seen ? "#FFFFFF" : "#FFFBEA"}>
      <Text>
        <Text
          style={{ fontWeight: "700", textDecorationLine: "underline" }}
          onPress={() => onUsernamePress(item)}
        >
          {item.id + " " + username}
        </Text>
        {" liked your photo"}
      </Text>
    </S.Card>

  );
}