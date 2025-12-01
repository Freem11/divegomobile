import React, { useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import readableDate from "../../helpers/readableDate";
import { Review, ReviewCondition } from "../../../entities/diveSiteReview";
import { cloudflareBucketUrl } from "../../globalVariables";

import * as S from "./styles";
import { renderLabel } from "./conditionLabel";
import Avatar from "./avatarCreator";
import { Menu } from "./Menu";

type ReviewCardViewProps = {
  userName: string;
  date: string;
  description: string;
  conditions: ReviewCondition[];
  photo: string;
  review: Review;
  currentUserId: string;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: number) => void;
};

export default function ReviewCardView({ userName, photo , date, description, conditions, review, currentUserId, onEdit, onDelete }: ReviewCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(0);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const fileName = photo?.split("/").pop();

  return (
    <S.Card>
      <S.Header>
        <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(12) }}>
          <Avatar photo={fileName && `${cloudflareBucketUrl}${fileName}`}/>
          <S.UserInfo>
            <S.Title>{userName}</S.Title>
            <S.Date>
              {date && readableDate(date)}
            </S.Date>
          </S.UserInfo>
        </View>

        <Menu
          isVisible={isPopoverVisible}
          setIsVisible={setIsPopoverVisible}
          handleEdit={() => onEdit(review)}
          handleDelete={() => onDelete(review.id)}
          isMyReview={currentUserId === review.user_id}
        />
      </S.Header>

      <S.Description>
        {isExpanded ? (
          <S.DescriptionTextExpanded>
            {description}
          </S.DescriptionTextExpanded>
        )
          : (
            <S.DescriptionTextCollapsed
              ellipsizeMode="tail"
              numberOfLines={isMeasuring === 0 ? undefined : 5}
              onTextLayout={(e) => {
                const lines = e.nativeEvent.lines.length;
                if (lines > 5) {
                  setIsOverflowing(true);
                }
                setIsMeasuring(5);
              }}
            >
              {description}
            </S.DescriptionTextCollapsed>
          )}

        {isOverflowing && (
          <S.ShowMoreText
            onPress={() => setIsExpanded(prev => !prev)}
          >
            {isExpanded ? "Read less" : "Read more"}
          </S.ShowMoreText>
        )}
        <S.LabelsContainer>
          {conditions && conditions.slice(0,6).map((condition) => {
            const label = renderLabel(condition);

            if (label) {
              return (
                <S.TagWrapper key={condition.condition_entry_id}>
                  <S.TagText>{label}</S.TagText>
                </S.TagWrapper>
              );
            }

          })}

        </S.LabelsContainer>
      </S.Description>
    </S.Card>
  );
}
