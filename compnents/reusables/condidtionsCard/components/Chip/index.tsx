import React from "react";

import { colors } from "../../../../styles";
import Icon from "../../../../../icons/Icon";
import { determineChipIcon, determineIcon } from "../../determineIcon";

import * as S from "./styles";

interface Chip {
  value: string;
  bgColor: string;
  textColor: string;
}

export default function Chip({ value, bgColor, textColor }: Chip) {

  if (!value) return;

  const icon = determineChipIcon(value);

  return (
    <S.HeaderCard bgColor={bgColor}>
      <S.IconBox>
        <Icon name={icon} color={textColor} />
      </S.IconBox>
      <S.TextLayout>
        <S.Title textColor={textColor}>{value}</S.Title>
      </S.TextLayout>
    </S.HeaderCard>

  );

};
