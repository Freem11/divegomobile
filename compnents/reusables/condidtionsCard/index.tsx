import { moderateScale } from "react-native-size-matters";
import React from "react";

import { ReviewCondition } from "../../../entities/diveSiteReview";

import * as S from "./styles";
import HeaderCard from "./components/HeaderCard";
import { formatConditions } from "./formatConditions";

interface ConditionsCard {
  conditions: ReviewCondition[]
}

export default function ConditionsCard({ conditions }: ConditionsCard) {

  const formattedConditions = conditions?.map((condition) => {
    return formatConditions(condition);
  });

  const visibility = formattedConditions?.find(c => c.id === 15);
  const allowedIds = [17, 18, 19, 20];

  let currents = formattedConditions?.find(c => allowedIds.includes(c.id));

  if (!currents) {
    currents = { "id": 0, "value": "No Current" };
  }

  console.log("formattedConditions", currents);

  return (

    <S.Body>
      <S.HeaderRow>
        <HeaderCard value={visibility?.value} />
        <HeaderCard value={currents?.value} />
      </S.HeaderRow>
    </S.Body>

  );

};
