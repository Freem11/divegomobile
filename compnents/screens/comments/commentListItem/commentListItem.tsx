import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, TextStyle, ViewStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import { activeFonts, colors, fontSizes } from "../styles";
import { cloudflareBucketUrl } from "../globalVariables";
import Avatar from "../reusables/reviewCard/avatarCreator";

export interface CommentDetails {
  id: number;
  profilePhoto?: string;
  content: string;
  replied_to?: number | null;
}

interface CommentListItemProps {
  commentDetails: CommentDetails;
  setReplyTo: (reply: [string, string] | null) => void;
  replyTo: [string, string] | null;
  toggleShowReplies: (comment: Comment) => void;
  selectedReplyId: number[];
  nbReplies: number;
}

export default function CommentListItem({
  commentDetails,
  setReplyTo,
  replyTo,
  toggleShowReplies,
  selectedReplyId,
  nbReplies,
}: CommentListItemProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();

  const newDate = new Date(commentDetails.created_at);
  let finalDate = newDate.toLocaleString().substring(0, 10);
  if (finalDate.endsWith(",")) {
    finalDate = finalDate.slice(0, -1);
  }

  const fileName = commentDetails.profilePhoto?.split("/").pop();
  const remoteUri = fileName ? `${cloudflareBucketUrl}${fileName}` : null;

  const content = commentDetails.content ?? "";
  const shouldShowReadMore = content.length > 90;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Avatar photo={remoteUri} />
          </View>
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
              : setReplyTo([commentDetails.username, String(commentDetails.id)])}
          hitSlop={10}
        >
          <Text style={styles.actionTxt}>Reply</Text>
        </Pressable>

        {nbReplies > 0 && (
          <Pressable
            onPress={() => toggleShowReplies(commentDetails)}
            hitSlop={10}
          >
            <Text style={styles.actionTxt}>
              {selectedReplyId.includes(commentDetails.id)
                ? t("Comments.hideReplies")
                : nbReplies === 1
                  ? t("Comments.viewReply", { count: nbReplies })
                  : t("Comments.viewReplies", { count: nbReplies })}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

interface Styles {
  wrapper: ViewStyle;
  card: ViewStyle;
  headerRow: ViewStyle;
  avatarContainer: ViewStyle;
  headerTextCol: ViewStyle;
  userTxt: TextStyle;
  dateTxt: TextStyle;
  contentTxt: TextStyle;
  readMoreTxt: TextStyle;
  actionsRow: ViewStyle;
  actionTxt: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
  avatarContainer: {
    height: moderateScale(28),
    width: moderateScale(28),
    marginRight: moderateScale(15),
    alignItems: "center",
    justifyContent: "center",
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