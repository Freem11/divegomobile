import React, { useState, useEffect, Fragment, ReactElement } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  KeyboardAvoidingView,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";

import ButtonIcon from "../reusables/buttonIcon";
import { activeFonts, colors, fontSizes } from "../styles";
import {
  grabPhotoCommentsByPicId,
  insertPhotoComment
} from "../../supabaseCalls/photoCommentSupabaseCalls";
import CommentListItem from "../commentListItem/commentListItem";
import { useUserProfile } from "../../store/user/useUserProfile";
import fallbackAvatar from "../../assets/icon.png";
import { cloudflareBucketUrl } from "../globalVariables";
import AvatarTextInputField from "../authentication/utils/textInputWithAvatar";
import { useAppNavigation } from "../mapPage/types";
import { getPhotoByID } from "../../supabaseCalls/seaLifePhotoCalls/gets";
import { Photo } from "../../entities/photos";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface Comment {
  id: number;
  replied_to: number | null;
  content: string;
  user_id: string;
}

type ReplyToState = [string, string] | null;

interface CommentsModalProps {
  id: number;
}

const screenWidth = Dimensions.get("window").width;

export default function CommentsModal({ id }: CommentsModalProps) {
  const [isClearOn, setIsClearOn] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [listOfComments, setListOfComments] = useState<Comment[] | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyToState>(null);
  const [selectedReplyId, setSelectedReplyId] = useState<number[]>([]);

  const { userProfile } = useUserProfile();
  const navigation = useAppNavigation();
  const { t } = useTranslation();

  const fileName = userProfile?.profilePhoto?.split("/").pop();
  const remoteUri = `${cloudflareBucketUrl}${fileName}`;
  const avatarSource: ImageSourcePropType = fileName ? { uri: remoteUri } : fallbackAvatar;

  useEffect(() => {
    getPhoto(id);
    getAllPictureComments(id);
  }, [id]);

  const getPhoto = async (picId: number): Promise<void> => {
    const pic = await getPhotoByID(picId);
    const picFileName = pic[0]?.photoFile.split("/").pop();
    const uri = `${cloudflareBucketUrl}${picFileName}`;
    setImage(uri);
  };

  const getAllPictureComments = async (picId: number): Promise<void> => {
    const picComments = await grabPhotoCommentsByPicId(picId);
    setListOfComments(picComments);
  };

  const handleChange = (text: string): void => {
    if (isClearOn) setIsClearOn(false);
    setCommentContent(text);
  };

  const handleCommentInsert = async (): Promise<void> => {
    let userIdentity: string | null = null;
    if (replyTo) userIdentity = replyTo[1];

    if (!commentContent || commentContent.trim() === "") return;

    const finalContent = replyTo ? `@${replyTo[0]} - ${commentContent}` : commentContent;

    await insertPhotoComment(
      userProfile.UserID,
      id,
      finalContent,
      userIdentity
    );

    setIsClearOn(true);
    setCommentContent("");
    setReplyTo(null);
    getAllPictureComments(id);
    Keyboard.dismiss();
  };

  const handleCommentModalClose = (): void => {
    navigation.goBack();
    setReplyTo(null);
  };

  const hideRepliesForChildren = (parentId: number, currentSelectedIds: number[]): number[] => {
    let newIds = [...currentSelectedIds.filter((id) => parentId !== id)];
    if (listOfComments) {
      listOfComments.forEach(comment => {
        if (comment.replied_to === parentId) {
          newIds = hideRepliesForChildren(comment.id, newIds);
        }
      });
    }
    return newIds;
  };

  const toggleShowReplies = (comment: Comment): void => {
    if (!comment?.id) return;
    if (selectedReplyId.includes(comment.id)) {
      setSelectedReplyId(hideRepliesForChildren(comment.id, selectedReplyId));
    } else {
      setSelectedReplyId([...selectedReplyId, comment.id]);
    }
  };

  const getCommentListView = (commentId: number | null, level: number = 0): ReactElement => {
    const marginLeft = 5 * level;
    const width = 100 - marginLeft;

    return (
      <ScrollView
        key={`parent-${commentId ?? 0}`}
        style={[styles.commentListContainer, { marginLeft: `${marginLeft}%` as any, width: `${width}%` as any }]}
      >
        {listOfComments &&
          listOfComments
            .filter((comment) => comment.replied_to === commentId)
            .map((commentDeets) => {
              const nbReplies = listOfComments.filter((c) => c.replied_to === commentDeets.id).length;
              const isVisible = commentDeets.replied_to === null || selectedReplyId.includes(commentDeets.replied_to);

              if (!isVisible) return null;

              return (
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
                </Fragment>
              );
            })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.commentScreen}>
      <View style={styles.commentsModal}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={handleCommentModalClose}>
            <View style={styles.commentHeader}>
              <View style={styles.tab} />
              <Text style={styles.headerText}>Comments</Text>
            </View>
          </TouchableWithoutFeedback>

          <Image
            source={{ uri: image }}
            style={{ width: screenWidth - moderateScale(64), height: screenWidth - moderateScale(64), resizeMode: "cover", borderRadius: moderateScale(40) }}
            contentFit="cover"
            transition={1000}
          />

          {getCommentListView(null)}

          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={moderateScale(310)}
            style={styles.keyboardAvoid}
          >
            <View style={styles.commentEntryContainer}>
              {replyTo && (
                <View style={styles.replyLine}>
                  <Text style={styles.userTxt}> @{replyTo[0]} </Text>
                  <ButtonIcon
                    icon="close"
                    onPress={() => setReplyTo(null)}
                    size="micro"
                    fillColor={colors.darkGrey}
                    style={{ marginTop: moderateScale(2) }}
                  />
                </View>
              )}
              <View style={styles.replyBox}>
                <AvatarTextInputField
                  avatarSource={avatarSource}
                  inputValue={commentContent || ""}
                  placeHolderText={t("Comments.blowBubbles")}
                  onChangeText={handleChange}
                  handleClear={handleCommentInsert}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

interface Styles {
  commentScreen: ViewStyle;
  commentsModal: ViewStyle;
  container: ViewStyle;
  commentHeader: ViewStyle;
  tab: ViewStyle;
  headerText: TextStyle;
  commentListContainer: ViewStyle;
  keyboardAvoid: ViewStyle;
  commentEntryContainer: ViewStyle;
  replyBox: ViewStyle;
  replyLine: ViewStyle;
  userTxt: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  commentScreen: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    backgroundColor: "transparent",
    zIndex: 26,
    left: 0,
  },
  commentsModal: {
    position: "absolute",
    height: windowHeight - windowHeight * 0.08,
    width: windowWidth,
    backgroundColor: colors.themeWhite,
    borderRadius: 15,
    zIndex: 27,
    left: 0,
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
    paddingBottom: moderateScale(10),
  },
  keyboardAvoid: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",

  },
  commentEntryContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    marginHorizontal: moderateScale(8)
  },
  replyBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "98%",
  },
  replyLine: {
    flexDirection: "row",
    height: moderateScale(35),
    marginBottom: moderateScale(-10),
    backgroundColor: colors.lighterBlue,
    marginRight: moderateScale(15),
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10)
  },
  userTxt: {
    fontFamily: activeFonts.Thin,
    fontSize: moderateScale(18),
    color: colors.themeBlack,
    marginTop: moderateScale(2),
    paddingBottom: moderateScale(4),
  },
});