import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { scale, moderateScale } from "react-native-size-matters";
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

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function CommentsModal() {
  const entryRef = useRef(0);
  const [commentContent, setCommentContent] = useState(null);
  const [listOfComments, setListOfComments] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const { profile } = useContext(UserProfileContext);
  const { selectedPicture, setSelectedPicture } = useContext(
    SelectedPictureContext
  );
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
    if(replyTo){
      userIdentity = replyTo[1]
    }
    if (commentContent === null || commentContent === "") {
      return;
    } else {
      let newComment = await insertPhotoComment(
        profile[0].UserID,
        selectedPicture.id,
        commentContent,
        userIdentity
      );
      setCommentContent(null);
      setReplyTo(null)
      getAllPictureComments(selectedPicture.id);
    }
  };


  const handleCommentModalClose = async () => {
    setReplyTo(null)
    setCommentsModal(false)
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => handleCommentModalClose()}>
        <View style={styles.commentHeader}>
          <View style={styles.tab}></View>
          <Text style={styles.headerText}>Comments</Text>
        </View>
      </TouchableWithoutFeedback>
      <ScrollView style={styles.commentListContainer}>
        {listOfComments &&
          listOfComments.map((commentDeets) => {
            return (
              <CommentListItem
                commentDetails={commentDeets}
                key={commentDeets.id}
                setReplyTo={setReplyTo}
                replyTo={replyTo}
              />
            );
          })}
      </ScrollView>

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
              <FontAwesome name="close" color="#BD9F9F" size={moderateScale(15)} onPress={() => setReplyTo(null)}/>
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
    // backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    marginBottom: "2%",
    width: "98%",
    marginLeft: "1%",
    minHeight: Platform.OS === "android" ? 490 : 0,
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
    // backgroundColor: "pink",
    width: "100%",
    height: "85%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: moderateScale(0.2),
  },
  keyboardAvoid: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "pink",
    width: "100%",
    height: "15%",
  },
  commentEntryContainer: {
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: moderateScale(60),
    // backgroundColor: "green",
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
    // backgroundColor: 'pink',
    width: "50%",
    marginBottom: moderateScale(-8),
    marginTop: moderateScale(10)
  },
  userTxt: {
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(13),
    color: "black",
    height: moderateScale(20),
    // backgroundColor: 'pink',
    // alignSelf: "flex-start",
    marginBottom: moderateScale(-15),
  },
});
