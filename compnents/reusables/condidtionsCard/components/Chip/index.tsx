import React from "react";

import { colors } from "../../../../styles";
import Icon from "../../../../../icons/Icon";
import { determineChipIcon, determineIcon } from "../../determineIcon";

import * as S from "./styles";

interface Chip {
  value: string;
}

export default function Chip({ value }: Chip) {

  if (!value) return;

  const icon = determineChipIcon(value);

  return (
    <S.HeaderCard bgColor={colors.primaryBlue}>
      <S.IconBox>
        <Icon name={icon} color={colors.themeWhite} />
      </S.IconBox>
      <S.TextLayout>
        <S.Title>{value}</S.Title>
      </S.TextLayout>
    </S.HeaderCard>

  );

};
