import React, { useEffect, Fragment, ReactElement, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  KeyboardAvoidingView,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

import ButtonIcon from "../reusables/buttonIcon";
import { activeFonts, colors, fontSizes } from "../styles";
import { grabPhotoCommentsByPicId, insertPhotoComment } from "../../supabaseCalls/photoCommentSupabaseCalls";
import CommentListItem from "../commentListItem/commentListItem";
import { useUserProfile } from "../../store/user/useUserProfile";
import fallbackAvatar from "../../assets/icon.png";
import { cloudflareBucketUrl } from "../globalVariables";
import AvatarTextInputField from "../authentication/utils/textInputWithAvatar";

import type { SharedValue } from "react-native-reanimated";


interface Comment {
  id: number;
  replied_to: number | null;
  content: string;
  user_id: string;
}

type ReplyToState = [string, string] | null;

type PhotoCommentsScreenProps = {
  id: number;
  contentScrollY: SharedValue<number>;
};

export default function PhotoCommentsScreen({ id, contentScrollY }: PhotoCommentsScreenProps) {
  const [isClearOn, setIsClearOn] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [listOfComments, setListOfComments] = useState<Comment[] | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyToState>(null);
  const [selectedReplyId, setSelectedReplyId] = useState<number[]>([]);

  const { userProfile } = useUserProfile();
  const { t } = useTranslation();

  const fileName = userProfile?.profilePhoto?.split("/").pop();
  const remoteUri = `${cloudflareBucketUrl}${fileName}`;
  const avatarSource: ImageSourcePropType = fileName ? { uri: remoteUri } : fallbackAvatar;

  useEffect(() => {
    getAllPictureComments(id);
  }, [id]);

  const getAllPictureComments = async (picId: number): Promise<void> => {
    const picComments = await grabPhotoCommentsByPicId(picId);
    setListOfComments(picComments);
  };

  const onScroll = useAnimatedScrollHandler({
  onScroll: (e) => {
    contentScrollY.value = e.contentOffset.y;
  },
});

  const handleChange = (text: string): void => {
    if (isClearOn) setIsClearOn(false);
    setCommentContent(text);
  };

  const handleCommentInsert = async (): Promise<void> => {
    try {
        let userIdentity: string | null = null;
        if (replyTo) userIdentity = replyTo[1];

        if (!commentContent || commentContent.trim() === "") return;

        const finalContent = replyTo ? `@${replyTo[0]} - ${commentContent}` : commentContent;

        setCommentContent("");
        setReplyTo(null);

        await insertPhotoComment(userProfile.UserID, id, finalContent, userIdentity);

        await getAllPictureComments(id);
        Keyboard.dismiss();
    } catch (e) {
        console.log("insert comment error:", e);
    }
};

  const hideRepliesForChildren = (parentId: number, currentSelectedIds: number[]): number[] => {
    let newIds = [...currentSelectedIds.filter((x) => parentId !== x)];
    if (listOfComments) {
      listOfComments.forEach((comment) => {
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
      <View
        key={`parent-${commentId ?? 0}`}
        style={{ marginLeft: `${marginLeft}%` as any, width: `${width}%` as any }}
      >
        {listOfComments &&
          listOfComments
            .filter((comment) => comment.replied_to === commentId)
            .map((commentDeets) => {
              const nbReplies = listOfComments.filter((c) => c.replied_to === commentDeets.id).length;
              const isVisible =
                commentDeets.replied_to === null || selectedReplyId.includes(commentDeets.replied_to);

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
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.headerText}>Comments</Text>

      <View style={styles.commentsContainer}>
        {listOfComments && listOfComments.length > 0 ? (
            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                style={{ width: "100%" }}
                contentContainerStyle={{ paddingBottom: moderateScale(20) }}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
            >
            {getCommentListView(null)}
          </Animated.ScrollView>
        ) : (
            <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No comments yet</Text>
            <Text style={styles.emptySubText}>Be the first to blow some bubbles 🫧</Text>
            <View style={styles.emptySpacer} />
            </View>
        )}
      </View>

      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={moderateScale(120)} style={styles.keyboardAvoid}>
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
              inputValue={commentContent}
              placeHolderText={t("Comments.blowBubbles")}
              onChangeText={handleChange}
              handleClear={handleCommentInsert}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

interface Styles {
  screen: ViewStyle;
  headerText: TextStyle;
  commentListContainer: ViewStyle;
  keyboardAvoid: ViewStyle;
  commentEntryContainer: ViewStyle;
  replyBox: ViewStyle;
  replyLine: ViewStyle;
  userTxt: TextStyle;
  commentsContainer: ViewStyle;
  emptyState: ViewStyle;
  emptyText: TextStyle;
  emptySubText: TextStyle;
  emptySpacer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  screen: {
    flex: 1,
    backgroundColor: colors.themeWhite,
    width: "100%",
    paddingTop: moderateScale(8),
  },
  headerText: {
    color: colors.themeBlack,
    fontFamily: activeFonts.Light,
    fontSize: fontSizes.Header,
    marginBottom: moderateScale(8),
    textAlign: "center",
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
    marginHorizontal: moderateScale(8),
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
    borderTopRightRadius: moderateScale(10),
  },
  userTxt: {
    fontFamily: activeFonts.Thin,
    fontSize: moderateScale(18),
    color: colors.themeBlack,
    marginTop: moderateScale(2),
    paddingBottom: moderateScale(4),
  },
  commentsContainer: {
    flex: 1,
  },

  emptyState: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: moderateScale(20),
  },
  emptyText: {
    fontFamily: activeFonts.Light,
    fontSize: moderateScale(18),
    color: colors.themeBlack,
    opacity: 0.7,
  },
  emptySubText: {
    marginTop: moderateScale(6),
    fontFamily: activeFonts.Thin,
    fontSize: moderateScale(14),
    color: colors.darkGrey,
    opacity: 0.6,
  },
  emptySpacer: {
    height: moderateScale(120),
  },
});
