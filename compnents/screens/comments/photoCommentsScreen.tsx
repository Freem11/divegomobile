import React, { Fragment, ReactElement, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import type { SharedValue } from "react-native-reanimated";
import { EdgeInsets } from "react-native-safe-area-context";

import { activeFonts, colors, fontSizes } from "../styles";
import CommentListItem from "../commentListItem/commentListItem";

import { CommentItem } from "./photoCommentsParallax";

type PhotoCommentsScreenProps = {
  id: number;
  contentScrollY: SharedValue<number>;
  replyTo: [string, string] | null;
  setReplyTo: React.Dispatch<React.SetStateAction<[string, string] | null>>;
  listOfComments: CommentItem[] | null;
  insets: EdgeInsets;
};

const windowWidth = Dimensions.get("window").width;

export default function PhotoCommentsScreen({
  replyTo,
  setReplyTo,
  listOfComments,
}: PhotoCommentsScreenProps) {
  const [selectedReplyId, setSelectedReplyId] = useState<number[]>([]);

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
    const width = windowWidth - marginLeft;

    return (
      <View
        key={`parent-${commentId ?? 0}`}
        style={{ marginLeft: marginLeft, width: width }}
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
      </View >
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.headerText}>Comments</Text>

      <View style={styles.commentsContainer}>
        {listOfComments && listOfComments.length > 0 ? (
          getCommentListView(null)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No comments yet</Text>
            <Text style={styles.emptySubText}>Be the first to blow some bubbles 🫧</Text>
            <View style={styles.emptySpacer} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  commentsContainer: {
    flex: 1,
    paddingBottom: moderateScale(120),
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