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

export default function ReviewCardView({
  userName,photo , date, description, conditions
}: ReviewCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(0);

  return (
    <S.Card>
      <S.CardTop>
        <S.Header>
          <Avatar photo={photo}/>
          <S.TopRow>
            <S.Title>{userName}</S.Title>
            <S.Date>
              {date && readableDate(date)}
            </S.Date>
          </S.TopRow>

        </S.Header>
      </S.CardTop>

      <S.Description>
        {isExpanded ? (
          <S.DescriptionTextExpanded>
            {description}
          </S.DescriptionTextExpanded>
        )
          : (
            <S.DescriptionTextCollapsed
              ellipsizeMode="tail"
              numberOfLines={isMeasuring === 0 ? undefined : 2}
              onTextLayout={(e) => {
                const lines = e.nativeEvent.lines.length;
                if (lines > 2){
                  setIsOverflowing(true);
                }
                setIsMeasuring(2);
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
          {conditions && conditions.map((condition) => {
            const label = renderLabel(condition);

            if (label){
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
