import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function CommentListItem(props) {
  const { commentDetails, setReplyTo, replyTo, toggleShowReplies, selectedReplyId, nbReplies } = props;
  let newDate = new Date(commentDetails.created_at);
  let finalDate = newDate.toLocaleString().substring(0, 9);

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
      {
        nbReplies > 0 ?
        <Text
          style={styles.replyTxt}
          onPress={() => toggleShowReplies(commentDetails)}
        >
          {
            selectedReplyId.includes(commentDetails.id)
            ? `Hide replies`
            : `View ${nbReplies} Replies`
          }
        </Text>
        : ""
      }
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#537bdb",
    justifyContent: "center",
    borderRadius: moderateScale(10),
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
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(13),
    color: "black",
  },
  dateTxt: {
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(12),
    color: "lightgrey",
  },
  contentTxt: {
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(16),
    color: "black",
  },
  replyTxt: {
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(14),
    color: "white",
    marginTop: moderateScale(5),
    marginLeft: moderateScale(25),
    borderBottomWidth: 0,
  },
});
