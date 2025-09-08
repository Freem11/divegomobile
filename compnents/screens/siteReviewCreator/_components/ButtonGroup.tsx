import React, { useState } from 'react'
import { IconName } from '../../../../icons/Icon'
import * as S from './styles'

export interface ButtonOption {
  label: string
  icon: IconName
  value: number
}

export interface ButtonGroupProps {
  options: ButtonOption[]
  multiple?: boolean
  onSelectionChange?: (selectedValues: any[]) => void
  initialSelected?: any[]
  columns?: number
}

export default function ButtonGroup({ 
  options, 
  multiple = false, 
  onSelectionChange,
  initialSelected = [],
  columns = 3
}: ButtonGroupProps) {
  const [selectedValues, setSelectedValues] = useState<any[]>(initialSelected)

  const handleButtonPress = (option: ButtonOption) => {
    const value = option.value !== undefined ? option.value : option.label
    let newSelectedValues: any[]

    if (multiple) {
      if (selectedValues.includes(value)) {
        newSelectedValues = selectedValues.filter(v => v !== value)
      } else {
        newSelectedValues = [...selectedValues, value]
      }
    } else {
      if (selectedValues.includes(value)) {
        newSelectedValues = []
      } else {
        newSelectedValues = [value]
      }
    }

    setSelectedValues(newSelectedValues)
    onSelectionChange?.(newSelectedValues)
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
