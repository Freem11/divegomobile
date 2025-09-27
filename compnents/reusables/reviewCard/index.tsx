import React, { useState } from "react";

import readableDate from "../../helpers/readableDate";
import { ReviewCondition } from "../../../entities/diveSiteReview";

import * as S from "./styles";
import { renderLabel } from "./conditionLabel";
import Avatar from "./avatarCreator";

type ReviewCardViewProps = {
  userName: string;
  date: string;
  description: string;
  conditions: ReviewCondition[];
  photo: string;
};

export default function ReviewCardView({ userName,photo , date, description, conditions }: ReviewCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(0);

  return (
    <S.Card>
      <S.Header>
        <Avatar photo={photo}/>
        <S.UserInfo>
          <S.Title>{userName}</S.Title>
          <S.Date>
            {date && readableDate(date)}
          </S.Date>
        </S.UserInfo>
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
