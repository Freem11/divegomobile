import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { DiveConditions } from "../../../entities/diveSiteCondidtions";
import { DiveSiteWithUserName } from "../../../entities/diveSite";

import { 
  ProgressBar, 
  StepNavigation, 
  Step1, 
  Step2, 
  Step3 
} from "./_components";
import { Form } from "./form";
import * as S from "./styles";

type ShopReviewCreatorProps = {
  datePickerVisible: boolean;
  showDatePicker: () => void;
  hideDatePicker: () => void;
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  isSubmitting: boolean
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  onSubmit: () => void;
  selectedDiveSite: DiveSiteWithUserName;
  unitSystem: string;
};

export default function SiteReviewPageView({
  datePickerVisible,
  showDatePicker,
  hideDatePicker,
  control,
  setValue,
  isSubmitting,
  errors,
  watch,
  onSubmit,
  unitSystem
}: ShopReviewCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [metrics] = useState(unitSystem === "Imperial" ? {
    highValueViz: 100,
    lowValueViz: 0,
    highValueCur: 6.5,
    lowValueCur: 0,
    simpleMetric: "ft",
    rateMetric: "ft/s"
  } : {
    highValueViz: 30,
    lowValueViz: 0,
    highValueCur: 2,
    lowValueCur: 0,
    simpleMetric: "m",
    rateMetric: "m/s"
  });

  const handleBooleanConditions = (buttonId: number, isMultiple: boolean = true) => {
    const conditions = watch("Conditions");
    const existingCondition = conditions.find(c => c.conditionId === buttonId);
    let updatedConditions = conditions;

    if (existingCondition) {
      updatedConditions = conditions.filter(c => c.conditionId !== buttonId);
    } else {
      if (isMultiple) {
        updatedConditions = [...conditions, { conditionId: buttonId, value: 1 }];
      } else {
        const groupConditions = getConditionGroup(buttonId);
        updatedConditions = conditions.filter(c => !groupConditions.includes(c.conditionId));
        updatedConditions = [...updatedConditions, { conditionId: buttonId, value: 1 }];
      }
    }

    setValue("Conditions", updatedConditions);
  };

  const getConditionGroup = (conditionId: number): number[] => {
    if (conditionId === DiveConditions.SALT_WATER || conditionId === DiveConditions.FRESH_WATER) {
      return [DiveConditions.SALT_WATER, DiveConditions.FRESH_WATER];
    }
    if ([DiveConditions.CURRENT_LATTERAL, DiveConditions.CURRENT_UP, DiveConditions.CURRENT_DOWN, DiveConditions.CURRENT_CONTRASTING].includes(conditionId)) {
      return [DiveConditions.CURRENT_LATTERAL, DiveConditions.CURRENT_UP, DiveConditions.CURRENT_DOWN, DiveConditions.CURRENT_CONTRASTING];
    }
    return [conditionId];
  };

  const handleSliderConditions = (condition_id: number, sliderValue: number) => {
    const conditions = watch("Conditions");
    const existingCondition = conditions.find(c => c.conditionId === condition_id);

    let updatedConditions = conditions;

    if (existingCondition) {
      updatedConditions = conditions.map(c =>
        c.conditionId === condition_id ? { ...c, value: sliderValue } : c
      );
    } else {
      updatedConditions = [...conditions, { conditionId: condition_id, value: sliderValue }];
    }

    if (condition_id === DiveConditions.CURRENT_INTENSITY && sliderValue === 0) {
      const dependentConditions = [
        DiveConditions.CURRENT_LATTERAL,
        DiveConditions.CURRENT_UP,
        DiveConditions.CURRENT_DOWN,
        DiveConditions.CURRENT_CONTRASTING
      ];

      updatedConditions = updatedConditions.filter(c => !dependentConditions.includes(c.conditionId));
    }

    setValue("Conditions", updatedConditions);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const diveDate = watch("DiveDate");
        return !!diveDate && diveDate.trim() !== "";
      case 2:
        return true;
      case 3:
        const description = watch("Description");
        return !!description && description.trim() !== "";
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            control={control}
            setValue={setValue}
            errors={errors}
            watch={watch}
            datePickerVisible={datePickerVisible}
            showDatePicker={showDatePicker}
            hideDatePicker={hideDatePicker}
            handleBooleanConditions={handleBooleanConditions}
          />
        );
      case 2:
        return (
          <Step2
            watch={watch}
            handleBooleanConditions={handleBooleanConditions}
            handleSliderConditions={handleSliderConditions}
            metrics={metrics}
          />
        );
      case 3:
        return (
          <Step3
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <S.ContentContainer>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <ScrollView 
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ paddingBottom: moderateScale(120) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
      >
        {renderCurrentStep()}
      </ScrollView>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={onSubmit}
        canGoNext={validateStep(currentStep)}
        isSubmitting={isSubmitting}
      />
    </S.ContentContainer>
  );
}