import React from 'react'
import { View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import styled from 'styled-components/native'
import Button from '../../../reusables/button'
import { colors } from '../../../styles'

const Container = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.themeWhite};
  padding: ${moderateScale(16)}px;
  padding-bottom: ${moderateScale(32)}px;
  border-top-width: 1px;
  border-top-color: ${colors.border};
`

const ButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
  gap: ${moderateScale(16)}px;
`

const BackButton = styled(Button)`
  flex: 1;
  height: ${moderateScale(48)}px;
  width: ${moderateScale(120)}px;
  border-radius: ${moderateScale(8)}px;
`

const NextButton = styled(Button)`
  height: ${moderateScale(48)}px;
  border-radius: ${moderateScale(8)}px;
  width: ${moderateScale(120)}px;
  align-self: flex-end;
  flex: 1;
`

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  isSubmitting?: boolean
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  canGoBack = true,
  canGoNext = true,
  isSubmitting = false
}) => {
  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1

  return (
    <Container>
      <ButtonContainer style={{ justifyContent: currentStep === 1 ? 'flex-end' : 'space-between' }}>
        {!isFirstStep && (
          <BackButton
            title={'Back'}
            alt={true}
            size={'thin'}
            disabled={!canGoBack}
            onPress={onBack}
            iconLeft={'chevron-left'}
          />
        )}
        {isFirstStep && <View style={{ flex: 1 }} />}
        
        {isLastStep ? (
          <NextButton
            title={'Submit'}
            alt={false}
            size={'thin'}
            disabled={isSubmitting}
            onPress={onSubmit}
          />
        ) : (
          <NextButton
            title={'Next'}
            alt={false}
            size={'thin'}
            disabled={!canGoNext}
            onPress={onNext}
            iconRight={'chevron-right'}
          />
        )}
      </ButtonContainer>
    </Container>
  )
}
