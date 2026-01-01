import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import Icon from "../../../../../icons/Icon";
import { determineChipIcon } from "../../determineIcon";

import * as S from "./styles";

interface Chip {
  value: string;
  bgColor: string;
  textColor: string;
  onPress: () => void;
}

export default function Chip({ value, bgColor, textColor, onPress }: Chip) {

  if (!value) return;

  const icon = determineChipIcon(value);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <S.HeaderCard bgColor={bgColor}>
        <S.IconBox>
          <Icon name={icon} color={textColor} />
        </S.IconBox>
        <S.TextLayout>
          <S.Title textColor={textColor}>{value}</S.Title>
        </S.TextLayout>
      </S.HeaderCard>
    </TouchableWithoutFeedback>
  );

};
