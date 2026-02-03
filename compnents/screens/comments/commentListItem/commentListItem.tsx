import React, { useState } from "react";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";

import Avatar from "../../../reusables/reviewCard/avatarCreator";

import * as S from "./styles";

export interface CommentDetails {
  id: number;
  profilePhoto?: string;
  content: string;
  replied_to?: number | null;
  UserName?: string
  created_at?: string
  public_domain: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface CommentListItemProps {
  commentDetails: CommentDetails;
  setReplyTo: (reply: [string, string] | null) => void;
  replyTo: [string, string] | null;
  toggleShowReplies: (comment: CommentDetails) => void;
  selectedReplyId: number[];
  nbReplies: number;
}

export default function CommentListItem({
  commentDetails,
  setReplyTo,
  replyTo,
  toggleShowReplies,
  selectedReplyId,
  nbReplies,
}: CommentListItemProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();

  const newDate = new Date(commentDetails.created_at);
  let finalDate = newDate.toLocaleString().substring(0, 10);
  if (finalDate.endsWith(",")) {
    finalDate = finalDate.slice(0, -1);
  }

  const remoteUri = commentDetails.public_domain ? `${commentDetails.public_domain}/${commentDetails.sm}` : null;
  const content = commentDetails.content ?? "";
  const shouldShowReadMore = content.length > 90;

  return (
    <S.Wrapper>
      <S.Card>
        <S.HeaderRow>
          <S.AvatarContainer>
            <Avatar photo={remoteUri} />
          </S.AvatarContainer>
          <S.HeaderTextCol>
            <S.UserTxt numberOfLines={1}>{commentDetails.UserName}</S.UserTxt>
            <S.DateTxt numberOfLines={1}>{finalDate}</S.DateTxt>
          </S.HeaderTextCol>
        </S.HeaderRow>

        <S.ContentTxt
          numberOfLines={expanded ? undefined : 3}
          ellipsizeMode="tail"
        >
          {content}
        </S.ContentTxt>

        {shouldShowReadMore && (
          <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={10}>
            <S.ReadMoreTxt>
              {expanded ? "Show less" : "Read more"}
            </S.ReadMoreTxt>
          </Pressable>
        )}
      </S.Card>

      <S.ActionsRow>
        <Pressable
          onPress={() =>
            replyTo?.[0] === commentDetails.UserName
              ? setReplyTo(null)
              : setReplyTo([commentDetails.UserName, String(commentDetails.id)])}
          hitSlop={10}
        >
          <S.ActionTxt>Reply</S.ActionTxt>
        </Pressable>

        {nbReplies > 0 && (
          <Pressable
            onPress={() => toggleShowReplies(commentDetails)}
            hitSlop={10}
          >
            <S.ActionTxt>
              {selectedReplyId.includes(commentDetails.id)
                ? t("Comments.hideReplies")
                : nbReplies === 1
                  ? t("Comments.viewReply", { count: nbReplies })
                  : t("Comments.viewReplies", { count: nbReplies })}
            </S.ActionTxt>
          </Pressable>
        )}
      </S.ActionsRow>
    </S.Wrapper>
  );
};
