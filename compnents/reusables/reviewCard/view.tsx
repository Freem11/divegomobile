import React, { useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import readableDate from "../../helpers/readableDate";
import { colors } from "../../styles";
import Icon from "../../../icons/Icon";
import { ReviewCondition } from "../../../entities/diveSiteReview";
import Label from "../label-new";

import * as S from "./styles";

type ReviewCardViewProps = {
  userName: string;
  date: string;
  description: string;
  conditions: ReviewCondition[]
};

export default function ReviewCardView({
  userName, date, description, conditions
}: ReviewCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(0);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  console.log("conditions", conditions);

  return (
    <S.Card>
      <S.CardTop>
        <S.Header>
          <S.Title>{userName}</S.Title>
        </S.Header>
        <View style={{ flexDirection: "row", marginRight: -moderateScale(2) }}>
          <Icon
            name={"calendar-month"}
            style={{ width: moderateScale(18), marginRight: moderateScale(4) }}
            fill={colors.darkGrey}
          />
          <S.Date>
            {date && readableDate(date)}
          </S.Date>
        </View>
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
        <S.ButtonsContainer>
          {conditions && conditions.map((condition) => (
            <S.TagWrapper key={condition.condition_entry_id}>
              <Label label={condition.condition_type_id}/>
            </S.TagWrapper>
          ))}

        </S.ButtonsContainer>
      </S.Description>
    </S.Card>
  );
}
