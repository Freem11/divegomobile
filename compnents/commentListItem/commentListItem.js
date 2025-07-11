import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import {
  activeFonts,
  colors,
  fontSizes
} from "../styles";

export default function CommentListItem(props) {
  const { commentDetails, setReplyTo, replyTo, toggleShowReplies, selectedReplyId, nbReplies } = props;
  const newDate = new Date(commentDetails.created_at);
  let finalDate = newDate.toLocaleString().substring(0, 10);
  const lastChar = finalDate.slice(-1)
  if (lastChar == ",") {
    finalDate = finalDate.slice(0, -1)
  }
  const { t } = useTranslation();
  return (
    <View>
      <View style={styles.container} key={commentDetails.id}>
        <View style={styles.topBox}>
          <Text style={styles.userTxt}>{commentDetails.username}</Text>
          <Text style={styles.dateTxt}>{finalDate}</Text>
        </View>

        <Text style={styles.contentTxt}>{commentDetails.content}</Text>
      </View>
      <Text
        style={styles.replyTxt}
        onPress={() => {
          replyTo && replyTo[0] === commentDetails.username
            ? setReplyTo(null)
            : setReplyTo([commentDetails.username, commentDetails.id]);
        }}
      >
        Reply
      </Text>
      {nbReplies > 0 ? (
        <Text
          style={styles.replyTxt}
          onPress={() => toggleShowReplies(commentDetails)}
        >
          {selectedReplyId.includes(commentDetails.id)
            ? t("Comments.hideReplies")
            : t("Comments.showReplies", { count: nbReplies })}
        </Text>
      )
        : ""}

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.themeWhite,
    justifyContent: "center",
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(0.5),
    width: "98%",
    marginLeft: "1%",
    marginTop: "2%",
    padding: "2%",
  },
  topBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "4%",
  },
  userTxt: {
    fontFamily: activeFonts.Bold,
    fontSize: moderateScale(fontSizes.SmallText),
    color: colors.themeBlack,
  },
  dateTxt: {
    fontFamily: activeFonts.ThinItalic,
    fontSize: fontSizes.SmallText,
    color: "darkgrey",
  },
  contentTxt: {
    fontFamily: activeFonts.Light,
    fontSize: fontSizes.StandardText,
    color: colors.themeBlack,
  },
  replyTxt: {
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(fontSizes.SmallText),
    color: colors.themeBlack,
    marginTop: moderateScale(5),
    marginLeft: moderateScale(25),
    borderBottomWidth: 0,
  },
});
