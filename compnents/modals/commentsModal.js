import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
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
  const [commentContent, setCommentContent] = useState(null);
  const [listOfComments, setListOfComments] = useState(null);
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

  console.log("comments?", listOfComments);

  const handleCommentInsert = async () => {
    if (commentContent !== null || commentContent !== " ") {
      let newComment = await insertPhotoComment(
        profile[0].UserID,
        selectedPicture.id,
        commentContent
      );
      setCommentContent(null);
      getAllPictureComments(selectedPicture.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentHeader}>
      <TouchableWithoutFeedback onPress={() => setCommentsModal(false)}>
          <View style={styles.tab}></View>
        </TouchableWithoutFeedback>
        <Text style={styles.headerText}>Comments</Text>
      </View>

      <ScrollView style={styles.commentListContainer}>
        {listOfComments &&
          listOfComments.map((commentDeets) => {
            return <CommentListItem commentDetails={commentDeets} />;
          })}
      </ScrollView>

      <View style={styles.commentEntryContainer}>
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
    alignItems: "center"
  },
  tab: {
    backgroundColor: "white",
    height: moderateScale(8),
    width: moderateScale(70),
    borderRadius: moderateScale(5)
  },
  headerText: {
    color: "white",
    fontFamily: "PatrickHand_400Regular",
    fontSize: 26,
    marginBottom: "2%"
  },
  commentListContainer: {
    // backgroundColor: "pink",
    width: "100%",
    height: "85%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 0.2,
  },
  commentEntryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "black",
    width: "90%",
    height: "15%",
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
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    paddingTop: moderateScale(10),
    paddingRight: moderateScale(15),
    paddingLeft: moderateScale(15),
    marginRight: moderateScale(5),
    marginLeft: moderateScale(-7),
  },
});
