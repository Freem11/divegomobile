import React from "react";

import { IconName } from "../../../icons/Icon";
import IconWithLabel from "../iconWithLabal";
import { colors } from "../../styles";

import * as S from "./styles";

type EmptyStateProps = {
  iconName: IconName
  text:     string
};

export default function EmptyState(props: EmptyStateProps) {
  return (
    <S.EmptyStateWrapper>
      <S.IconSetWrapper>
        <S.IconSetWrapperLeft>
          <IconWithLabel
            buttonAction={null}
            label={null}
            iconName={props.iconName}
            fillColor="white"
            bgColor={colors.primaryBlue}
          />
        </S.IconSetWrapperLeft>
        <S.IconSetWrapperCenter>
          <IconWithLabel
            buttonAction={null}
            label={null}
            iconName={props.iconName}
            fillColor="white"
            bgColor={colors.primaryBlue}
          />
        </S.IconSetWrapperCenter>
        <S.IconSetWrapperRight>
          <IconWithLabel
            buttonAction={null}
            label={null}
            iconName={props.iconName}
            fillColor="white"
            bgColor={colors.primaryBlue}
          />
        </S.IconSetWrapperRight>
      </S.IconSetWrapper>
      <S.StyledLabelText>{props.text}</S.StyledLabelText>
    </S.EmptyStateWrapper>
  );
}
