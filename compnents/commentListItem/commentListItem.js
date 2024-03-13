import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { scale } from "react-native-size-matters";
// import { ProfileModalContext } from "../contexts/profileModalContext";

export default function CommentListItem(props) {
  const { commentDetails } = props;

  console.log("stuff", commentDetails);

  let newDate = commentDetails.created_at.substring(0, 10);

  return (
    <View style={styles.container} key={commentDetails.id}>
      <View style={styles.topBox}>
        <Text style={styles.userTxt}>{commentDetails.userId}</Text>
        <Text style={styles.dateTxt}>{newDate}</Text>
      </View>

      <Text style={styles.contentTxt}>{commentDetails.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#537bdb",
    justifyContent: "center",
    borderRadius: 10,
    width: "98%",
    marginLeft: "1%",
    marginTop: "2%",
    padding: "2%"
  },
  topBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "4%",
  },
  userTxt: {
    fontFamily: "Itim_400Regular",
    fontSize: 13,
    color: "black"
  },
  dateTxt: {
    fontFamily: "Itim_400Regular",
    fontSize: 12,
    color: "lightgrey"
  },
  contentTxt: {
    fontFamily: "Itim_400Regular",
    fontSize: 16,
    color: "black"
  },
});
