import React from 'react';
import * as S from './styles';
import './style.scss';

type LabelProps = {
  className?: string
  children?:  React.ReactElement
  label?:     React.ReactNode
};

export default function Label(props: LabelProps) {
  return (
    <S.StyledLabelWrapper>
      <S.StyledLabelText>{props.label}</S.StyledLabelText>
    </S.StyledLabelWrapper>

  );
};
