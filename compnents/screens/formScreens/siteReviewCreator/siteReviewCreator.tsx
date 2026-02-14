import React, { useState, useEffect, useCallback } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DiveConditions } from "../../../../entities/diveSiteCondidtions";
import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { ReviewPhotos } from "../../../../entities/diveSiteReview";
import { ProgressBar } from "../progressBar";
import { StepNavigation } from "../stepNavigation";
import * as S from "../styles";

import { Step1, Step2, Step3, Step4 } from "./_components";
import { Form } from "./form";

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
  isCompleted?: boolean;
  trigger: UseFormTrigger<Form>;
  existingPhotos: ReviewPhotos[]
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
  unitSystem,
  isCompleted = false,
  trigger,
  existingPhotos,
  getMoreAnimals
}: ShopReviewCreatorProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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

  const handleGoNext = useCallback(async() => {
    let fieldsToValidate: (keyof Form)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["DiveDate"];
        break;
      case 2:
        fieldsToValidate = [];
        break;
      case 3:
        fieldsToValidate = [];
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, trigger]);

  useEffect(() => {
    if (isCompleted) {
      setCurrentStep(4);
    }
  }, [isCompleted]);

  const description = watch("Description");
  const canSubmit = description && description.trim().length > 0;

  return (
    <S.ContentContainer insets={insets}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingBottom: moderateScale(120) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
      >
        {currentStep === 1 && (
          <Step1
            control={control}
            setValue={setValue}
            errors={errors}
            watch={watch}
            datePickerVisible={datePickerVisible}
            showDatePicker={showDatePicker}
            hideDatePicker={() => {
              hideDatePicker();
              void trigger(["DiveDate"]);
            }}
            handleBooleanConditions={handleBooleanConditions}
          />
        )}
        {currentStep === 2 && (
          <Step2
            watch={watch}
            handleBooleanConditions={handleBooleanConditions}
            handleSliderConditions={handleSliderConditions}
            metrics={metrics}
          />
        )}
        {currentStep === 3 && (
          <Step3
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
            existingPhotos={existingPhotos}
          />
        )}
        {currentStep === 4 && (
          <Step4 />
        )}
      </ScrollView>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={() => setCurrentStep(currentStep - 1)}
        onNext={handleGoNext}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        canSubmit={canSubmit}
      />
    </S.ContentContainer>
  );
}