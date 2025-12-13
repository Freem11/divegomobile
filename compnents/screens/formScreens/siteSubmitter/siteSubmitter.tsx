import React, { useState, useEffect, useCallback } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ReviewPhotos } from "../../../../entities/diveSiteReview";
import { ProgressBar } from "../progressBar";
import { StepNavigation } from "../stepNavigation";
import * as S from "../styles";
import { combineComponents } from "../../../combineComponents";

import { Step1 } from "./_components/Step1";
import { Step2 } from "./_components/Step2";
import { Form } from "./form";

type ShopSubmitterProps = {
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  isSubmitting: boolean
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  onSubmit: () => void;
  isCompleted?: boolean;
  trigger: UseFormTrigger<Form>;
  existingPhotos: ReviewPhotos[]
};

export default function SiteSubmitterPageView({
  control,
  setValue,
  isSubmitting,
  errors,
  watch,
  onSubmit,
  isCompleted = false,
  trigger
}: ShopSubmitterProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleGoNext = useCallback(async () => {
    let fieldsToValidate: (keyof Form)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["Site", "Latitude", "Longitude"];
        break;
      case 2:
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

  console.log("control", control);

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
          />
        )}
        {currentStep === 2 && (
          <Step2 />
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