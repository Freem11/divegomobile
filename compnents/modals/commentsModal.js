import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions
} from "react-native";
import {
  activeFonts,
  colors,
  fontSizes
} from "../styles";
import TextInputField from '../authentication/utils/textInput';
import React, { useState, useContext, useEffect, Fragment } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedPictureContext } from "../contexts/selectedPictureContext";
import {
  insertPhotoComment,
  grabPhotoCommentsByPicId,
} from "../../supabaseCalls/photoCommentSupabaseCalls";
import { ScrollView } from "react-native-gesture-handler";
import CommentListItem from "../commentListItem/commentListItem";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { useTranslation } from "react-i18next";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function CommentsModal() {
  const [isClearOn, setIsClearOn] = useState(false);
  const [commentContent, setCommentContent] = useState(null);
  const [listOfComments, setListOfComments] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [selectedReplyId, setSelectedReplyId] = useState([]);
  const { profile } = useContext(UserProfileContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { selectedPicture } = useContext(SelectedPictureContext);
  const { fullScreenModal, setFullScreenModal } = useContext(
    FullScreenModalContext
  );
  const { t } = useTranslation();
  useEffect(() => {
    if (selectedPicture) {
      getAllPictureComments(selectedPicture.id);
    }
  }, [fullScreenModal]);

  const getAllPictureComments = async (picId) => {
    let picComments = await grabPhotoCommentsByPicId(picId);
    setListOfComments(picComments);
  };

  const handleChange = (text) => {
    if (isClearOn) {
      setIsClearOn(false)
      return
    }
    setCommentContent(text)
  };

  const handleCommentInsert = async () => {
    let userIdentity = null
    if (replyTo) {
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
      // let newComment = await insertPhotoComment(
      //   profile[0].UserID,
      //   selectedPicture.id,
      //   finalContent,
      //   userIdentity
      // );
      setIsClearOn(true)
      setCommentContent("");
      setReplyTo(null);
      getAllPictureComments(selectedPicture.id);
      Keyboard.dismiss()
    }
  };


  const handleCommentModalClose = async () => {
    setReplyTo(null)
    //todo: needs to be able to reroute to user profile photos page as well
    setActiveTutorialID("DiveSitePhotos");
  }

  const hideRepliesForChildren = (parentId, newSelectedReplyId) => {
    newSelectedReplyId = [...newSelectedReplyId.filter((id) => parentId !== id)];
    for (comment of listOfComments) {
      if (comment.replied_to === parentId) {
        newSelectedReplyId = hideRepliesForChildren(comment.id, newSelectedReplyId);
      }
    }

    return newSelectedReplyId;
  }

  const toggleShowReplies = (comment) => {
    if (selectedReplyId.includes(comment.id)) {
      let selectedReplyIdTemp = hideRepliesForChildren(comment.id, selectedReplyId);
      setSelectedReplyId(selectedReplyIdTemp);
    } else {
      setSelectedReplyId([...selectedReplyId, comment.id]);
    }
  }

  const getCommentListView = (commentId, level = 0) => {
    let marginLeft = 5 * level;
    let width = 98 - marginLeft;
    const marginStyle = StyleSheet.create({
      commentLevelShift: {
        marginLeft: `${marginLeft}%`,
        width: `${width}%`,
      }
    });

    return (
      <ScrollView key={`parent-${commentId ? commentId : 0}`} style={[styles.commentListContainer, marginStyle.commentLevelShift]}>
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
                selectedReplyId.includes(commentDeets.replied_to) || commentDeets.replied_to === null ?
                  <Fragment key={commentDeets.id}>
                    <CommentListItem
                      commentDetails={commentDeets}
                      setReplyTo={setReplyTo}
                      replyTo={replyTo}
                      toggleShowReplies={toggleShowReplies}
                      selectedReplyId={selectedReplyId}
                      nbReplies={nbReplies}
                    />
                    {getCommentListView(commentDeets.id, level + 1)}
                  </Fragment> : null
              );
            }
          }
          )}
      </ScrollView>
    )
  }

  return (
    <View style={styles.commentScreen}>
      <View style={styles.commentsModal}>
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
                  <FontAwesome name="close" color="darkgrey" size={moderateScale(15)} onPress={() => setReplyTo(null)} />
                </View>
              ) : null}
              <View style={styles.replyBox}>
                <TextInputField
                  inputValue={commentContent}
                  placeHolderText={t('Comments.blowBubbles')}
                  onChangeText={(text) => handleChange(text)}
                  handleClear={() => handleCommentInsert()}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentScreen: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 26,
    left: 0,
  },
  commentsModal: {
    position: "absolute",
    height: windowHeight - windowHeight * 0.38,
    width: windowWidth,
    backgroundColor: colors.themeWhite,
    borderRadius: 15,
    zIndex: 27,
    left: 0,
    opacity: 1,
    bottom: 0,
    borderWidth: 1,
    borderColor: "darkgrey",
  },
  container: {
    flex: 1,
    backgroundColor: colors.themeWhite,
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
    backgroundColor: colors.themeBlack,
    height: moderateScale(6),
    width: moderateScale(60),
    borderRadius: moderateScale(5),
  },
  headerText: {
    color: colors.themeBlack,
    fontFamily: activeFonts.Light,
    fontSize: fontSizes.Header,
    marginBottom: "2%",
  },
  commentListContainer: {
    flex: 1,
    width: "100%",
    height: "85%",
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
    backgroundColor: colors.themeWhite,
    marginTop: moderateScale(5),
    marginLeft: moderateScale(-10)
  },
  replyBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: "3%",
    width: "98%",
    height: "100%",
  },
  replyLine: {
    flexDirection: "row",
    backgroundColor: colors.themeWhite,
    marginLeft: moderateScale(15),
    marginRight: moderateScale(55),
    marginBottom: moderateScale(-14),
    marginTop: moderateScale(10),
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10)
  },
  userTxt: {
    fontFamily: activeFonts.Thin,
    fontSize: moderateScale(13),
    color: colors.themeBlack,
    marginBottom: moderateScale(-15),
    marginRight: moderateScale(5)
  },
});
