import React from "react";

import { Values } from "..";

import * as S from "./styles";

export type DropdownProps = {
  options: Values;
  children: React.ReactNode;
  searchText: string;
  shouldDisplayCreate: boolean;
  createItem: (value: string) => void;
};

export default function Dropdown(props: DropdownProps) {
  return (
    <S.Dropdown>
      <S.OptionList>
        {props.children}

        {props.shouldDisplayCreate && (
          <S.CreateButton
            onPress={() => props.createItem(props.searchText)}
          >
            <S.TextWrapper>
              Create <S.SearchTerm>{props.searchText}</S.SearchTerm>
            </S.TextWrapper>
          </S.CreateButton>
        )}
      </S.OptionList>
    </S.Dropdown>
  );
}
