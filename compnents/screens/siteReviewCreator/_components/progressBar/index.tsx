import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

import * as S from './styles'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current
  const progressPercentage = (currentStep / totalSteps) * 100

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercentage,
      duration: 400,
      useNativeDriver: false,
    }).start()
  }, [currentStep, totalSteps, progressPercentage, animatedWidth])

  const widthStyle = {
    width: animatedWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
  }

  return (
    <S.Container>
      <S.ProgressBarContainer>
        <S.ProgressBarFill style={widthStyle} />
      </S.ProgressBarContainer>
    </S.Container>
  )
}
