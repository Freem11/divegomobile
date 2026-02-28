import React from "react";
import * as S from "./styles";
import { Notification } from "../../../store/types";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import ButtonIcon from "../../../../reusables/buttonIcon";
import { colors } from "../../../../styles";
import fallbackAvatar from "../../../../../assets/icon.png";
import { cloudflareBucketUrl } from "../../../../globalVariables";

type Props = {
  item: Notification;
  onUsernamePress: (n: Notification) => void;
  onTrashPress: (n: Notification) => void;
  onPhotoPress: (n: Notification) => void;
};

export default function NotificationItemPhotoLike({
  item,
  onUsernamePress,
  onTrashPress,
  onPhotoPress,
}: Props) {
  const username = item?.sender?.username ?? "Unknown user";
  const fileName = item.sender.profilePhoto?.split("/").pop();
  const remoteUri = `${cloudflareBucketUrl}${fileName}`;
  const avatarSource = fileName ? { uri: remoteUri } : fallbackAvatar;

  return (
    <S.Card style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => onUsernamePress(item)}>
          <Image source={avatarSource} style={styles.image} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15 }}>
            <Text style={{ fontWeight: "600" }}>{username}</Text>
            {" liked your photo of a "}
            <Text style={styles.photo_text} onPress={() => onPhotoPress(item)}>
              {item.notification_photo_like?.photo?.label ?? "creature"}
            </Text>
          </Text>
        </View>
        <View>
          <ButtonIcon
            icon="close"
            onPress={() => onTrashPress(item)}
            size="micro"
            fillColor={colors.darkGrey}
          />
        </View>
      </View>
    </S.Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.themeWhite,
    borderRadius: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  image: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    borderWidth: 1,
  },

  textContainer: {
    flex: 1,
  },

  photo_text: {
    fontWeight: "600",
    color: colors.primaryBlue,
  },
});
