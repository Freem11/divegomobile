import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import bubbles from "../png/bubbles.png";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedPictureContext } from "../contexts/selectedPictureContext";
import { CommentsModalContext } from "../contexts/commentsModalContext";
import {
  insertPhotoComment,
  grabPhotoCommentsByPicId,
} from "../../supabaseCalls/photoCommentSupabaseCalls";
import { ScrollView } from "react-native-gesture-handler";
import CommentListItem from "../commentListItem/commentListItem";

export default function CommentsModal() {
  const [commentContent, setCommentContent] = useState(null);
  const [listOfComments, setListOfComments] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const { profile } = useContext(UserProfileContext);
  const { selectedPicture } = useContext(SelectedPictureContext);
  const { commentsModal, setCommentsModal } = useContext(CommentsModalContext);

  useEffect(() => {
    if (selectedPicture) {
      getAllPictureComments(selectedPicture.id);
    }
  }, [commentsModal]);

  const getAllPictureComments = async (picId) => {
    let picComments = await grabPhotoCommentsByPicId(picId);
    setListOfComments(picComments);
  };

  const handleCommentInsert = async () => {
    let userIdentity = null
    if (replyTo){
      userIdentity = replyTo[1]
    }
    if (commentContent === null || commentContent === "") {
      return;
    } else {
      let finalContent
      if (replyTo) {
        finalContent = "@" + replyTo[0] + " - " + commentContent
      } else {
        finalContent = commentContent
      }
      let newComment = await insertPhotoComment(
        profile[0].UserID,
        selectedPicture.id,
        finalContent,
        userIdentity
      );
      setCommentContent(null);
      setReplyTo(null);
      getAllPictureComments(selectedPicture.id);
    }
  };


  const handleCommentModalClose = async () => {
    setReplyTo(null)
    setCommentsModal(false)
  }

  const getCommentListView = (commentId, level=0) => {
    let marginLeft = 5 * level; 
    let width = 98 - marginLeft;
    const marginStyle = StyleSheet.create({
      commentLevelShift: {
        marginLeft: `${marginLeft}%`, 
        width: `${width}%`,
      }
    });
    return (
      <ScrollView key={`parent-${commentId}`} style={[styles.commentListContainer, marginStyle.commentLevelShift]}>
        {listOfComments &&
          listOfComments.map((commentDeets) => {
            if (commentDeets.replied_to === commentId) {
              let nbReplies = 0;
              for (let comment of listOfComments) {
                if (comment.replied_to === commentDeets.id) {
                  nbReplies++;
                }
              }
              return (
                <>
                  <CommentListItem
                    commentDetails={commentDeets}
                    key={commentDeets.id}
                    setReplyTo={setReplyTo}
                    replyTo={replyTo}
                  />
                  {getCommentListView(commentDeets.id, level+1)}
                </>
              );
            }
          }
        )}
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => handleCommentModalClose()}>
        <View style={styles.commentHeader}>
          <View style={styles.tab}></View>
          <Text style={styles.headerText}>Comments</Text>
        </View>
      </TouchableWithoutFeedback>
      {getCommentListView(null)}

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? moderateScale(650) - moderateScale(340)
            : moderateScale(650) - moderateScale(340)
        }
        style={styles.keyboardAvoid}
      >
        <View style={styles.commentEntryContainer}>
          {replyTo ? (
            <View style={styles.replyLine}>
              <Text style={styles.userTxt}>@{replyTo[0]}</Text>
              <FontAwesome name="close" color="lightgrey" size={moderateScale(15)} onPress={() => setReplyTo(null)}/>
            </View>
          ) : null}
          <View style={styles.replyBox}>
            <TextInput
              style={styles.input}
              value={commentContent}
              placeholder={"Blow some bubbles"}
              placeholderTextColor="darkgrey"
              fontSize={moderateScale(16)}
              color={"grey"}
              multiline={true}
              onChangeText={(text) => setCommentContent(text)}
            ></TextInput>
            <TouchableWithoutFeedback onPress={() => handleCommentInsert()}>
              <Image
                source={bubbles}
                style={[
                  {
                    height: moderateScale(36),
                    width: moderateScale(36),
                  },
                ]}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    marginBottom: "2%",
    width: "98%",
    marginLeft: "1%",
  },
  commentHeader: {
    alignItems: "center",
  },
  tab: {
    backgroundColor: "white",
    height: moderateScale(8),
    width: moderateScale(70),
    borderRadius: moderateScale(5),
  },
  headerText: {
    color: "white",
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(26),
    marginBottom: "2%",
  },
  commentListContainer: {
    flex: 1,
    width: "100%",
    height: "85%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: moderateScale(0.2),
  },
  keyboardAvoid: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "15%",
  },
  commentEntryContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: moderateScale(60),
    backgroundColor: "#538bdb",
    marginTop: moderateScale(5),
  },
  replyBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    height: "100%",
  },
  input: {
    flex: 1,
    fontFamily: "Itim_400Regular",
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    width: moderateScale(280),
    height: moderateScale(40),
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    verticalAlign: "middle",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    paddingRight: moderateScale(15),
    paddingLeft: moderateScale(15),
    marginRight: moderateScale(5),
    marginLeft: moderateScale(-7),
    paddingTop: Platform.OS === "ios" ? moderateScale(10) : moderateScale(0),
  },
  replyLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#537dbd',
    marginLeft: moderateScale(10),
    marginRight: moderateScale(55),
    marginBottom: moderateScale(-8),
    marginTop: moderateScale(10),
    borderTopRightRadius: moderateScale(15),
    borderTopLeftRadius: moderateScale(15),
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10)
  },
  userTxt: {
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(13),
    color: "lightgrey",
    marginBottom: moderateScale(-15),
  },
});
