import React, { useEffect, useState } from 'react'
import { Animated } from 'react-native'
import { UseFormWatch } from 'react-hook-form'
import { moderateScale } from 'react-native-size-matters'
import { useTranslation } from 'react-i18next'

import { DiveConditions } from '../../../../entities/diveSiteCondidtions'
import ReusableSlider from '../../../reusables/slider'
import ButtonGroup from '../../../reusables/buttonGroup'
import { Form } from '../form'
import * as S from '../styles'

interface Step2Props {
  watch: UseFormWatch<Form>
  handleBooleanConditions: (buttonId: number, isMultiple?: boolean) => void
  handleSliderConditions: (conditionId: number, sliderValue: number) => void
  metrics: {
    highValueViz: number
    lowValueViz: number
    highValueCur: number
    lowValueCur: number
    simpleMetric: string
    rateMetric: string
  }
}

export const Step2: React.FC<Step2Props> = ({
  watch,
  handleBooleanConditions,
  handleSliderConditions,
  metrics
}) => {
  const { t } = useTranslation()
  const [showCurrentButtons, setShowCurrentButtons] = useState(false)
  const [heightAnim] = useState(new Animated.Value(0))

  const conditions = watch('Conditions') || []
  const currentIntensity = conditions.find(c => c.conditionId === DiveConditions.CURRENT_INTENSITY)?.value || 0

  const waterConditions = conditions
    .filter(c => [DiveConditions.NO_REFS, DiveConditions.MAX_DEPTH, DiveConditions.KELP, DiveConditions.POLLUTION].includes(c.conditionId))
    .map(c => c.conditionId)

  const currentDirectionConditions = conditions
    .filter(c => [DiveConditions.CURRENT_LATTERAL, DiveConditions.CURRENT_UP, DiveConditions.CURRENT_DOWN, DiveConditions.CURRENT_CONTRASTING].includes(c.conditionId))
    .map(c => c.conditionId)

  useEffect(() => {
    if (currentIntensity > 0) {
      setShowCurrentButtons(true)
      Animated.timing(heightAnim, {
        toValue: moderateScale(150),
        duration: 300,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowCurrentButtons(false)
      })
    }
  }, [currentIntensity, heightAnim])

  return (
    <S.InputGroupContainer>
      <S.Title>{t('DiveSiteReviewer.step2Title')}</S.Title>
      <S.Subtitle>{t('DiveSiteReviewer.step2Description')}</S.Subtitle>
      
      <S.Label>{t('DiveSiteReviewer.inTheWater')}</S.Label>
      <ButtonGroup
        selectedValues={waterConditions}
        onButtonPress={(buttonId) => handleBooleanConditions(buttonId, true)}
        columns={2}
        options={[
          {
            label: t('DiveSiteReviewer.noRefsButton'),
            icon: 'GPS-splash',
            value: DiveConditions.NO_REFS
          },
          {
            label: t('DiveSiteReviewer.limitsButton'),
            icon: 'warning-diamond',
            value: DiveConditions.MAX_DEPTH
          },
          {
            label: t('DiveSiteReviewer.kelpButton'),
            icon: 'plant',
            value: DiveConditions.KELP
          },
          {
            label: t('DiveSiteReviewer.pollutionButton'),
            icon: 'beer-bottle',
            value: DiveConditions.POLLUTION
          }
        ]}
      />

      <S.Spacer />

      <ReusableSlider
        inverted
        title={t('DiveSiteReviewer.viz')}
        leftValue={metrics.lowValueViz}
        rightValue={metrics.highValueViz}
        unitMeasurement={metrics.simpleMetric}
        onValueChange={(value) => handleSliderConditions(DiveConditions.VISIBILITY, value)}
      />

      <S.Spacer />

      <ReusableSlider
        title={t('DiveSiteReviewer.current')}
        leftValue={metrics.lowValueCur}
        rightValue={metrics.highValueCur}
        unitMeasurement={metrics.rateMetric}
        onValueChange={(value) => handleSliderConditions(DiveConditions.CURRENT_INTENSITY, value)}
      />

      {showCurrentButtons && (
        <Animated.View style={{ height: heightAnim, overflow: 'hidden' }}>
          <S.Label>{t('DiveSiteReviewer.currentDirection')}</S.Label>

          <ButtonGroup
            selectedValues={currentDirectionConditions}
            onButtonPress={(buttonId) => handleBooleanConditions(buttonId, false)}
            columns={2}
            options={[
              {
                label: t('DiveSiteReviewer.latCurrentButton'),
                icon: 'arrow-left-right',
                value: DiveConditions.CURRENT_LATTERAL
              },
              {
                label: t('DiveSiteReviewer.upCurrentButton'),
                icon: 'circle-arrow-up',
                value: DiveConditions.CURRENT_UP
              },
              {
                label: t('DiveSiteReviewer.downCurrentButton'),
                icon: 'circle-arrow-down',
                value: DiveConditions.CURRENT_DOWN
              },
              {
                label: t('DiveSiteReviewer.contrastCurrentButton'),
                icon: 'arrow-left-right-reverse',
                value: DiveConditions.CURRENT_CONTRASTING
              }
            ]}
          />
        </Animated.View>
      )}
    </S.InputGroupContainer>
  )
}
