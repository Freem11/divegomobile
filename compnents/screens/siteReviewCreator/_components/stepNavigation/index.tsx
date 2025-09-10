import React from 'react'
import { View } from 'react-native'

import * as S from './styles'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting?: boolean
  canSubmit?: boolean
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  canSubmit = true
}) => {
  const isLastStep = currentStep === (totalSteps - 1)
  const isCompleteStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1

  if (isCompleteStep) {
    return;
  }

  return (
    <S.Container>
      <S.ButtonContainer style={{ justifyContent: currentStep === 1 ? 'flex-end' : 'space-between' }}>
        {!isFirstStep && (
          <S.BackButton
            title={'Back'}
            alt={true}
            size={'thin'}
            disabled={isSubmitting}
            onPress={onBack}
            iconLeft={'chevron-left'}
          />
        )}
        {isFirstStep && <View style={{ flex: 1 }} />}
        
        {isLastStep ? (
          <S.NextButton
            title={isSubmitting ? 'Submitting...' : 'Submit'}
            alt={false}
            size={'thin'}
            disabled={isSubmitting || !canSubmit}
            onPress={onSubmit}
          />
        ) : (
          <S.NextButton
            title={'Next'}
            alt={false}
            size={'thin'}
            disabled={isSubmitting}
            onPress={onNext}
            iconRight={'chevron-right'}
          />
        )}
      </S.ButtonContainer>
    </S.Container>
  )
}
