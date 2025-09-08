import React, { useEffect, useRef } from 'react'
import { moderateScale } from 'react-native-size-matters'
import styled from 'styled-components/native'
import { Animated } from 'react-native'

import { colors } from '../../../styles'

const Container = styled.View`
  width: 100%;
`

const ProgressBarContainer = styled.View`
  height: ${moderateScale(3)}px;
  background-color: ${colors.lighterGrey};
  border-radius: ${moderateScale(2)}px;
  overflow: hidden;
`

const ProgressBarFill = styled(Animated.View)`
  height: 100%;
  background-color: ${colors.primaryBlue};
  border-radius: ${moderateScale(2)}px;
`

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
    <Container>
      <ProgressBarContainer>
        <ProgressBarFill style={widthStyle} />
      </ProgressBarContainer>
    </Container>
  )
}
