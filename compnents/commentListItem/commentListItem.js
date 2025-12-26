import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import { activeFonts, colors, fontSizes } from "../styles";
import fallbackAvatar from "../../assets/icon.png";
import { cloudflareBucketUrl } from "../../compnents/globalVariables";

export default function CommentListItem(props) {
  const {
    commentDetails,
    setReplyTo,
    replyTo,
    toggleShowReplies,
    selectedReplyId,
    nbReplies,
  } = props;

  const [expanded, setExpanded] = useState(false);

  const newDate = new Date(commentDetails.created_at);
  let finalDate = newDate.toLocaleString().substring(0, 10);
  const lastChar = finalDate.slice(-1);
  if (lastChar == ",") {
    finalDate = finalDate.slice(0, -1);
  }

  const fileName = commentDetails.profilePhoto?.split("/").pop();
  const remoteUri = fileName ? `${cloudflareBucketUrl}${fileName}` : null;
  const avatarSource = remoteUri ? { uri: remoteUri } : fallbackAvatar;

  const content = commentDetails.content ?? "";
  const shouldShowReadMore = expanded || content.length > 90;

  const { t } = useTranslation();

  return (
    <View style={styles.wrapper} key={commentDetails.id}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Image source={avatarSource} style={styles.avatar} />

          <View style={styles.headerTextCol}>
            <Text style={styles.userTxt} numberOfLines={1}>
              {commentDetails.username}
            </Text>
            <Text style={styles.dateTxt} numberOfLines={1}>
              {finalDate}
            </Text>
          </View>
        </View>

        <Text
          style={styles.contentTxt}
          numberOfLines={expanded ? undefined : 3}
          ellipsizeMode="tail"
        >
          {content}
        </Text>

        {shouldShowReadMore && (
          <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={10}>
            <Text style={styles.readMoreTxt}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={() =>
            replyTo?.[0] === commentDetails.username
              ? setReplyTo(null)
              : setReplyTo([commentDetails.username, commentDetails.id])}
          hitSlop={10}
        >
          <Text style={styles.actionTxt}>Reply</Text>
        </Pressable>

        {nbReplies > 0 ? (
          <Pressable
            onPress={() => toggleShowReplies(commentDetails)}
            hitSlop={10}
          >
            <Text style={styles.actionTxt}>
              {selectedReplyId.includes(commentDetails.id)
                ? t("Comments.hideReplies")
                : nbReplies === 1 ? t("Comments.viewReply", { count: nbReplies }) :t("Comments.viewReplies", { count: nbReplies })}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: moderateScale(12),
    marginTop: moderateScale(10),
  },

  card: {
    backgroundColor: colors.themeWhite,
    borderRadius: moderateScale(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lighterGrey,
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(8),
  },

  avatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    marginRight: moderateScale(10),
  },

  headerTextCol: {
    flex: 1,
    flexDirection: "column",
  },

  userTxt: {
    fontFamily: activeFonts.Bold,
    fontSize: moderateScale(fontSizes.SmallText - 1),
    lineHeight: moderateScale(18),
    color: colors.themeBlack,
  },

  dateTxt: {
    fontFamily: activeFonts.Thin,
    fontSize: moderateScale(fontSizes.SmallText - 3),
    lineHeight: moderateScale(16),
    color: colors.darkGrey,
    marginTop: moderateScale(1),
  },

  contentTxt: {
    fontFamily: activeFonts.Light,
    fontSize: moderateScale(fontSizes.StandardText),
    lineHeight: moderateScale(20),
    color: colors.themeBlack,
  },

  readMoreTxt: {
    marginTop: moderateScale(6),
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(fontSizes.SmallText),
    color: colors.darkGrey,
  },

  actionsRow: {
    flexDirection: "row",
    gap: moderateScale(16),
    marginTop: moderateScale(8),
    paddingLeft: moderateScale(6),
  },

  actionTxt: {
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(fontSizes.SmallText - 1),
    color: colors.darkGrey,
  },
});
