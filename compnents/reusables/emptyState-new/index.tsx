import React from "react";

import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";
import Label from "../label-new";

import * as S from "./styles";

type EmptyStateProps = {
  iconName: IconName
  title: string
  subtitle: string
};

export default function EmptyState(props: EmptyStateProps) {
  return (
    <S.EmptyStateWrapper>
      <S.IconContainer>
        <S.IconWrapper>
          <Icon name={props.iconName} fill={colors.neutralGrey} />
        </S.IconWrapper>
      </S.IconContainer>
      <Label label={props.title} />
      <S.Subtitle>{props.subtitle}</S.Subtitle>
    </S.EmptyStateWrapper>
  );
}
