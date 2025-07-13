import React from "react";
import * as S from './styles';

export type BottomMenuProps = {
  children?: React.ReactNode;
};

export default function BottomMenu(props: BottomMenuProps) { 
  const { children } = props;

  return (
    <S.MenuContainer>{children}</S.MenuContainer>
  );
};
