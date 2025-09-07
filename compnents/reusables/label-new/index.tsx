import React from "react";

import * as S from "./styles";

type LabelProps = {
  className?: string
  children?:  React.ReactElement
  label?:     React.ReactNode
};

export default function Label(props: LabelProps) {
  console.log("Hey",props.label);
  return (
    <S.StyledLabelText>{props.label}</S.StyledLabelText>
  );
};
