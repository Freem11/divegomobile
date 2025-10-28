import React from 'react'
import { View, Dimensions } from 'react-native'
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form'
import { TouchableWithoutFeedback as Toucher } from 'react-native-gesture-handler'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { moderateScale } from "react-native-size-matters"
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { DiveConditions } from '../../../../entities/diveSiteCondidtions'
import MobileTextInput from '../../../reusables/textInput'
import ButtonGroup from '../../../reusables/buttonGroup'
import * as S from '../styles'
import { Form, FormRules } from '../form'

interface Step1Props {
  control: Control<Form, any, Form>
  setValue: (name: keyof Form, value: any) => void
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  datePickerVisible: boolean
  showDatePicker: () => void
  hideDatePicker: () => void
  handleBooleanConditions: (buttonId: number, isMultiple?: boolean) => void
}

export const Step1: React.FC<Step1Props> = ({
  control,
  setValue,
  errors,
  watch,
  datePickerVisible,
  showDatePicker,
  hideDatePicker,
  handleBooleanConditions
}) => {
  const { t } = useTranslation()
  const screenWidth = Dimensions.get('window').width
 
  const conditions = watch('Conditions') || []
  
  const diveTypeConditions = conditions
    .filter(condition => condition.conditionId >= 1 && condition.conditionId <= 6)
    .map(condition => condition.conditionId)

  const waterTypeConditions = conditions
    .filter(condition => condition.conditionId >= 7 && condition.conditionId <= 8)
    .map(condition => condition.conditionId)

  const surfaceConditions = conditions
    .filter(condition => condition.conditionId >= 9 && condition.conditionId <= 10)
    .map(condition => condition.conditionId)

  const handleDatePickerConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD')
    setValue('DiveDate', formattedDate)
    hideDatePicker()
  }

  return (
    <S.InputGroupContainer>
      <S.Title>{t('DiveSiteReviewer.step1Title')}</S.Title>
      <S.Subtitle>{t('DiveSiteReviewer.step1Description')}</S.Subtitle>
      
      <S.Label>{t('DiveSiteReviewer.diveDate')}</S.Label>
      <Controller
        control={control}
        name={'DiveDate'}
        rules={FormRules.DiveDate}
        render={({ field: { onChange, value } }) => (
          <Toucher onPress={() => showDatePicker()}>
            <View pointerEvents={'none'} style={{ width: screenWidth - moderateScale(32) }}>
              <MobileTextInput
                error={errors.DiveDate}
                iconLeft={'calendar-month'}
                placeholder={t('DiveSiteReviewer.datePlaceholder')}
                onChangeText={onChange}
                value={value}
              />
            </View>
          </Toucher>
        )}
      />

      <S.Label>{t('DiveSiteReviewer.typOfDive')}</S.Label>
      <ButtonGroup
        selectedValues={diveTypeConditions}
        onButtonPress={(buttonId) => handleBooleanConditions(buttonId, true)}
        options={[
          {
            label: t('DiveSiteReviewer.shoreDiveButton'),
            icon: 'island',
            value: DiveConditions.SHORE_DIVE
          },
          {
            label: t('DiveSiteReviewer.boatDiveButton'),
            icon: 'sailboat',
            value: DiveConditions.BOAT_DIVE
          },
          {
            label: t('DiveSiteReviewer.nightDiveButton'),
            icon: 'moon-stars',
            value: DiveConditions.NIHGT_DIVE
          },
          {
            label: t('DiveSiteReviewer.altitudeDiveButton'),
            icon: 'mountains',
            value: DiveConditions.ALTITUDE_DIVE
          },
          {
            label: t('DiveSiteReviewer.wreckDiveButton'),
            icon: 'anchor-alt',
            value: DiveConditions.WREAK_DIVE
          },
          {
            label: t('DiveSiteReviewer.caveDiveButton'),
            icon: 'vinyl-record',
            value: DiveConditions.CAVE_DIVE
          }
        ]}
      />

      <S.Label>{t('DiveSiteReviewer.typeOfWater')}</S.Label>
      <ButtonGroup
        selectedValues={waterTypeConditions}
        onButtonPress={(buttonId) => handleBooleanConditions(buttonId, false)}
        options={[
          {
            label: t('DiveSiteReviewer.saltWaterButton'),
            icon: 'salt-water',
            value: DiveConditions.SALT_WATER
          },
          {
            label: t('DiveSiteReviewer.freshWaterButton'),
            icon: 'fresh-water',
            value: DiveConditions.FRESH_WATER
          }
        ]}
        columns={2}
      />

      <S.Label>{t('DiveSiteReviewer.atTheSurface')}</S.Label>
      <ButtonGroup
        selectedValues={surfaceConditions}
        onButtonPress={(buttonId) => handleBooleanConditions(buttonId, true)}
        columns={2}
        options={[
          {
            label: t('DiveSiteReviewer.trafficButton'),
            icon: 'traffic-light',
            value: DiveConditions.SURFACE_TRAFFIC
          },
          {
            label: t('DiveSiteReviewer.surgeButton'),
            icon: 'waves',
            value: DiveConditions.SURGE
          }
        ]}
      />

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode={'date'}
        date={new Date()}
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </S.InputGroupContainer>
  )
}
