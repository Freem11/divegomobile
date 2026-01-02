import React from "react";

import { ReviewCondition } from "../../../entities/diveSiteReview";
import { colors } from "../../styles";

import * as S from "./styles";
import HeaderCard from "./components/HeaderCard";
import { formatConditions } from "./formatConditions";
import Chip from "./components/Chip";
import { ConditionChip } from "./condidtionsChip";

interface ConditionsCard {
  conditions: ReviewCondition[]
}

export default function ConditionsCard({ conditions }: ConditionsCard) {
  const visibilityValue = conditions?.find(c => c.condition_type_id === 15).value;

  const intensityValue = conditions?.find(c => c.condition_type_id === 16)?.value;

  const formattedConditions = conditions?.map((condition) => {
    return formatConditions(condition, intensityValue);
  });

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

  const EXPLANATIONS: Record<number, string> = {
    1: "A shore entry dive, typically involving walking into the water from land.",
    2: "A dive conducted from a vessel, providing access to offshore or deeper sites.",
    3: "A dive conducted in low-light or total darkness, requiring specialized equipment.",
    4: "A dive at an altitude above 1,000ft (300m), requiring specific decompression adjustments.",
    5: "An overhead environment dive where a direct vertical ascent to the surface is not possible.",
    6: "Exploration of sunken vessels, aircraft, or artificial structures.",
    7: "A dive conducted in a marine environment with higher buoyancy than fresh water.",
    8: "A dive in fresh water, requiring less weight and more precise buoyancy control than salt water.",
    9: "Presence of boat traffic, surfers, or other vessels during ascent and at the surface.",
    10: "Heavy water movement or swell at the surface, often caused by wind or tide.",
    11: "A dive without visual landmarks, such as in open 'blue/black' water or low visibility.",
    12: "The seabed depth exceeds standard recreational limits (130ft / 40m).",
    13: "Dense aquatic vegetation present, requiring care to avoid entanglement.",
    14: "Presence of pollutants, runoff, or debris that may affect health or visibility.",
  };

  return (

    <S.Body>
      <S.HeaderRow>
        <HeaderCard value={visibility?.value} vizVal={visibilityValue} />
        <HeaderCard value={currents?.value} />
      </S.HeaderRow>

      <S.MidSection>
        {nightDive && <ConditionChip explanation={EXPLANATIONS[3]} value={nightDive?.value} bgColor={colors.themeBlack} textColor={colors.themeWhite} />}
        {saltWater && <ConditionChip explanation={EXPLANATIONS[7]} value={saltWater?.value} bgColor={colors.primaryBlue} textColor={colors.themeWhite} />}
        {freshWater && <Chip value={freshWater?.value} bgColor={colors.primaryBlue} textColor={colors.themeWhite} />}
      </S.MidSection>

      <S.LowerSection>
        {(boatDive || shoreDive || altitudeDive || caveDive || wreckDive) && <S.RowLabel>Type of dive</S.RowLabel>}
        <S.Row>
          <ConditionChip explanation={EXPLANATIONS[2]} value={boatDive?.value} bgColor={colors.primaryBlue} textColor={colors.themeWhite} />
          <ConditionChip explanation={EXPLANATIONS[1]} value={shoreDive?.value} bgColor={colors.primaryBlue} textColor={colors.themeWhite} />
          <ConditionChip explanation={EXPLANATIONS[4]} value={altitudeDive?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <ConditionChip explanation={EXPLANATIONS[5]} value={caveDive?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <ConditionChip explanation={EXPLANATIONS[6]} value={wreckDive?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
        </S.Row>
        {(surge || surfaceTraffic) && <S.RowLabel>At the surface</S.RowLabel>}
        <S.Row>
          <ConditionChip explanation={EXPLANATIONS[10]} value={surge?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <ConditionChip explanation={EXPLANATIONS[9]} value={surfaceTraffic?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
        </S.Row>
        {(noRefpts || bottomLimits || kelp || pollution) && <S.RowLabel>In the water</S.RowLabel>}
        <S.Row>
          <ConditionChip explanation={EXPLANATIONS[11]} value={noRefpts?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <ConditionChip explanation={EXPLANATIONS[12]} value={bottomLimits?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <ConditionChip explanation={EXPLANATIONS[13]} value={kelp?.value} bgColor={colors.orangeLight} textColor={colors.themeBlack} />
          <ConditionChip explanation={EXPLANATIONS[14]} value={pollution?.value} bgColor={colors.green} textColor={colors.themeWhite} />
        </S.Row>
      </S.LowerSection>

    </S.Body>

  );

};
