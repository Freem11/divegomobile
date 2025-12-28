import React from "react";

import Icon from "../../../../../icons/Icon";
import { determineIcon, determineIntensity, determineViz } from "../../determineIcon";

import * as S from "./styles";

interface HeaderCard {
  value: string;
  vizVal?: number;
}

export default function HeaderCard({ value, vizVal }: HeaderCard) {

  if (!value) return;

  const arrangedText = value?.trim().split(/\s+/) || [];
  const [first, ...rest] = arrangedText;
  const restOfText = rest.join(" ").trimStart();
  const icon = determineIcon(first, rest);

  let colors: { bgColor: string, textColor: string };

  if (vizVal) {
    colors = determineViz(vizVal);
  } else {
    colors = determineIntensity(first);
  }
  ;
  return (
    <S.HeaderCard bgColor={colors.bgColor}>
      <S.IconBox>
        <Icon name={icon} color={colors.textColor} />
      </S.IconBox>
      <S.TextLayout>
        <S.TitleBig bgColor={colors.textColor}>{first}</S.TitleBig>
        <S.Title bgColor={colors.textColor}>{restOfText}</S.Title>
      </S.TextLayout>
    </S.HeaderCard>

  );

};
