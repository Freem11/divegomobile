import React, { Fragment, ReactElement, useState } from "react";
import {
  View,
  Dimensions,
} from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { EdgeInsets } from "react-native-safe-area-context";

import * as S from "./styles";
import CommentListItem from "./commentListItem/commentListItem";
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

  const toggleShowReplies = (comment: CommentItem): void => {
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
    <S.MainScreen>
      <S.HeaderText>Comments</S.HeaderText>

      <S.CommentsContainer>
        {listOfComments && listOfComments.length > 0 ? (
          getCommentListView(null)
        ) : (
          <S.EmptyState>
            <S.EmptyText>No comments yet</S.EmptyText>
            <S.EmptySubText>Be the first to blow some bubbles 🫧</S.EmptySubText>
            <S.EmptySpacer />
          </S.EmptyState>
        )}
      </S.CommentsContainer>
    </S.MainScreen>
  );
}
