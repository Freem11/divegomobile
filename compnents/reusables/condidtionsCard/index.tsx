import React from "react";

import { ReviewCondition } from "../../../entities/diveSiteReview";
import { colors } from "../../styles";

import * as S from "./styles";
import HeaderCard from "./components/HeaderCard";
import { formatConditions } from "./formatConditions";
import Chip from "./components/Chip";

interface ConditionsCard {
  conditions: ReviewCondition[]
}

export default function ConditionsCard({ conditions }: ConditionsCard) {

  console.log("conditions", conditions);
  const formattedConditions = conditions?.map((condition) => {
    return formatConditions(condition);
  });

  console.log("formattedConditions", formattedConditions);
  const visibility = formattedConditions?.find(c => c.id === 15);

  const allowedIds = [17, 18, 19, 20];
  let currents = formattedConditions?.find(c => allowedIds.includes(c.id));

  if (!currents) {
    currents = { "id": 0, "value": "No Current" };
  }

  const nightDive = formattedConditions?.find(c => c.id === 3);

  const saltWater = formattedConditions?.find(c => c.id === 7);
  const freshWater = formattedConditions?.find(c => c.id === 8);

  //type of dive
  const shoreDive = formattedConditions?.find(c => c.id === 1);
  const boatDive = formattedConditions?.find(c => c.id === 2);
  const altitudeDive = formattedConditions?.find(c => c.id === 4);
  const wreckDive = formattedConditions?.find(c => c.id === 5);
  const caveDive = formattedConditions?.find(c => c.id === 6);

  //at the surface
  const surfaceTraffic = formattedConditions?.find(c => c.id === 9);
  const surge = formattedConditions?.find(c => c.id === 10);

  //in the water
  const noRefpts = formattedConditions?.find(c => c.id === 11);
  const bottomLimits = formattedConditions?.find(c => c.id === 12);
  const kelp = formattedConditions?.find(c => c.id === 13);
  const pollution = formattedConditions?.find(c => c.id === 14);

  console.log(currents);
  return (

    <S.Body>
      <S.HeaderRow>
        <HeaderCard value={visibility?.value} />
        <HeaderCard value={currents?.value} />
      </S.HeaderRow>

      <S.MidSection>
        {nightDive && <Chip value={nightDive?.value} bgColor={colors.themeBlack} textColor={colors.themeWhite} />}
        {saltWater && <Chip value={saltWater?.value} bgColor={colors.primaryBlue} textColor={colors.themeWhite} />}
        {freshWater && <Chip value={freshWater?.value} bgColor={colors.primaryBlue} textColor={colors.themeWhite} />}
      </S.MidSection>

      <S.LowerSection>
        {(boatDive || shoreDive || altitudeDive || caveDive || wreckDive) && <S.RowLabel>Type of dive</S.RowLabel>}
        <S.Row>
          <Chip value={boatDive?.value} bgColor={colors.primaryBlue} textColor={colors.themeWhite} />
          <Chip value={shoreDive?.value} bgColor={colors.primaryBlue} textColor={colors.themeWhite} />
          <Chip value={altitudeDive?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <Chip value={caveDive?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <Chip value={wreckDive?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
        </S.Row>
        {(surge || surfaceTraffic) && <S.RowLabel>At the surface</S.RowLabel>}
        <S.Row>
          <Chip value={surge?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <Chip value={surfaceTraffic?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
        </S.Row>
        {(noRefpts || bottomLimits || kelp || pollution) && <S.RowLabel>In the water</S.RowLabel>}
        <S.Row>
          <Chip value={noRefpts?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <Chip value={bottomLimits?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <Chip value={kelp?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <Chip value={pollution?.value} bgColor={colors.green} textColor={colors.themeWhite} />
        </S.Row>
      </S.LowerSection>

    </S.Body>

  );

};
