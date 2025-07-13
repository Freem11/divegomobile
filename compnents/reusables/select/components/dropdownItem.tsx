import React from 'react';
import { Option } from '..';
import * as S from './styles';

export type DropdownItemProps = {
  option: Option;
  selected: boolean;
  onSelect: (key: string) => void;
};

export default function DropdownItem({ option, selected, onSelect }: DropdownItemProps) {
  return (
    <S.ItemWrapper>
      <S.ItemButton
        onPress={() => onSelect(option.key)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        selected={selected}
      >
        <S.ItemText>{option.label}</S.ItemText>
      </S.ItemButton>
    </S.ItemWrapper>
  );
}