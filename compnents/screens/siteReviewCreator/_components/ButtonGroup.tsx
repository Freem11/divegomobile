import React from 'react'
import { IconName } from '../../../../icons/Icon'
import * as S from './styles'

export interface ButtonOption {
  label: string
  icon: IconName
  value: number
}

export interface ButtonGroupProps {
  options: ButtonOption[]
  onButtonPress?: (buttonId: number) => void
  selectedValues?: any[]
  columns?: number
}

export default function ButtonGroup({ 
  options, 
  onButtonPress,
  selectedValues = [],
  columns = 3
}: ButtonGroupProps) {
  const handleButtonPress = (option: ButtonOption) => {
    onButtonPress?.(option.value)
  }

  const isSelected = (option: ButtonOption) => {
    return selectedValues.includes(option.value)
  }

  const rows: ButtonOption[][] = []
  for (let i = 0; i < options.length; i += columns) {
    rows.push(options.slice(i, i + columns))
  }

  return (
    <S.ButtonGroupContainer>
      {rows.map((row, rowIndex) => (
        <S.ButtonRow key={rowIndex}>
          {row.map((option) => (
            <S.StyledButton
              key={option.value}
              size={'thin'}
              title={option.label}
              iconLeft={option.icon}
              active={isSelected(option)}
              round={false}
              onPress={() => handleButtonPress(option)}
            />
          ))}
        </S.ButtonRow>
      ))}
    </S.ButtonGroupContainer>
  )
}
