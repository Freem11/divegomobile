import React, { useState, useEffect, useCallback } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native";

import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { ReviewPhotos } from "../../../../entities/diveSiteReview";
import { ProgressBar } from "../progressBar";
import { StepNavigation } from "../stepNavigation";
import * as S from "../styles";

import { Step1, Step2, Step3, Step4 } from "./_components";
import { Form } from "./form";

type ShopReviewCreatorProps = {
  datePickerVisible: boolean;
  dateType: string;
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

export default function TripCreatorPageView({
  datePickerVisible,
  dateType,
  showDatePicker,
  hideDatePicker,
  control,
  setValue,
  isSubmitting,
  errors,
  watch,
  onSubmit,
  isCompleted = false,
  trigger,
  existingPhotos
}: ShopReviewCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleGoNext = useCallback(async () => {
    let fieldsToValidate: (keyof Form)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["Name", "Link", "Price", "Start", "End"];
        break;
      case 2:
        fieldsToValidate = ["Details"];
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

  const description = watch("Details");
  const canSubmit = description && description.trim().length > 0;

  return (
    <S.ContentContainer>
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
            dateType={dateType}
            errors={errors}
            watch={watch}
            datePickerVisible={datePickerVisible}
            showDatePicker={showDatePicker}
            hideDatePicker={() => {
              hideDatePicker();
              void trigger(["Start", "End"]);
            }}
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