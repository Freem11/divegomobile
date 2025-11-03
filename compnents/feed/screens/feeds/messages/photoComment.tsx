import React from "react";
import {  Text } from "react-native";
import * as S from "./styles";
import { Notification } from "../../../store/types";

type Props = {
  item: Notification;
  onUsernamePress: (n: Notification) => void;
};

export default function FeedItemPhotoComment({ item, onUsernamePress }: Props) {
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
        {" commented your photo"}
      </Text>
    </S.Card>
  );
}
