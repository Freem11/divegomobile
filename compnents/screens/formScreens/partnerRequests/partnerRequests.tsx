import React, { useState, useEffect, useCallback } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ReviewPhotos } from "../../../../entities/diveSiteReview";
import { ProgressBar } from "../progressBar";
import { StepNavigation } from "../stepNavigation";
import * as S from "../styles";

import { Step1 } from "./_components/Step1";
import { Step2 } from "./_components/Step2";
import { Step3 } from "./_components/Step3";
import { Form } from "./form";

type PartnerRequestProps = {
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  isSubmitting: boolean
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  onSubmit: () => void;
  isCompleted?: boolean;
  trigger: UseFormTrigger<Form>;
  existingPhotos: ReviewPhotos[]
  getCurrentLocation: () => void;
  useMapFlip: () => void;
  values: Form
};

export default function PartnerRequestPageView({
  control,
  setValue,
  isSubmitting,
  errors,
  watch,
  onSubmit,
  isCompleted = false,
  trigger,
  getCurrentLocation,
  useMapFlip,
  values
}: PartnerRequestProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleGoNext = useCallback(async () => {
    let fieldsToValidate: (keyof Form)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [];
        break;
      case 2:
        fieldsToValidate = ["OrgName", "URL", "Latitude", "Longitude"];
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
      setCurrentStep(3);
    } else {
      setCurrentStep(1);
    }
  }, [isCompleted]);

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
          <Step1 />
        )}
        {currentStep === 2 && (
          <Step2
            control={control}
            setValue={setValue}
            errors={errors}
            watch={watch}
            getCurrentLocation={getCurrentLocation}
            useMapFlip={useMapFlip}
            values={values}
          />
        )}
        {currentStep === 3 && (
          <Step3 />
        )}
      </ScrollView>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={() => setCurrentStep(currentStep - 1)}
        onNext={handleGoNext}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </S.ContentContainer>
  );
}