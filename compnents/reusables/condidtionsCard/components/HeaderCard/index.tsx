import { moderateScale } from "react-native-size-matters";
import React, { useRef, useState, forwardRef } from "react";
import { View } from "react-native";

import { colors } from "../../../../styles";
import Icon from "../../../../../icons/Icon";
import { determineIcon } from "../../determineIcon";

import * as S from "./styles";

interface HeaderCard {
  value: string;
}

export default function HeaderCard({ value }: HeaderCard) {

  if (!value) return;

  const arrangedText = value?.trim().split(/\s+/) || [];
  const [first, ...rest] = arrangedText;
  const restOfText = rest.join(" ").trimStart();
  const icon = determineIcon(first, rest);

  console.log(restOfText);
  return (
    <S.HeaderCard bgColor={colors.primaryBlue}>
      <S.IconBox>
        <Icon name={icon} color={colors.themeWhite} />
      </S.IconBox>
      <S.TextLayout>
        <S.Title>{first}</S.Title>
        <S.Title>{restOfText}</S.Title>
      </S.TextLayout>
    </S.HeaderCard>

  );

};
