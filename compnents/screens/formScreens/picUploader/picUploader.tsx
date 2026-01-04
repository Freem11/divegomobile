import React, { useState, useEffect, useCallback } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { ReviewPhotos } from "../../../../entities/diveSiteReview";
import { ProgressBar } from "../progressBar";
import { StepNavigation } from "../stepNavigation";
import * as S from "../styles";

import { Step1, StepX, Step3 } from "./_components";
import { Form } from "./form";

type PicUploaderProps = {
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
  isCompleted?: boolean;
  trigger: UseFormTrigger<Form>;
  existingPhotos: ReviewPhotos[]
  getMoreAnimals: (search: string, limit: number, skip: number) => Promise<any>
};

export default function PicUploaderPageView({
  datePickerVisible,
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
  getMoreAnimals,
}: PicUploaderProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const images = watch("Photos") || [];
  const steps = images.length + 2;

  useEffect(() => {
    if (isCompleted) {
      setCurrentStep(currentStep + 1);
    }
  }, [isCompleted]);

  const handleGoNext = useCallback(async () => {
    let fieldsToValidate: (keyof Form | string)[] = [];
    const maxStepX = images.length + 1;

    if (currentStep === 1) {
      fieldsToValidate = ["SightingDate", "Photos"];

    } else if (currentStep > 1 && currentStep <= maxStepX) {
      const fieldIndex = currentStep - 2;
      const fieldName = `SeaLife.${fieldIndex}`;

      const currentValue = watch(fieldName as keyof Form);
      setValue(fieldName as keyof Form, currentValue, { shouldTouch: true });

      fieldsToValidate = [fieldName];
    } else {
      fieldsToValidate = [];
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as (keyof Form)[]);

      if (isValid) {
        setCurrentStep(currentStep + 1);
      } else {
        console.log("Validation Failed, Errors:", errors);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, trigger, images.length, watch, setValue]);

  const lastIndex = images.length > 0 ? images.length - 1 : 0;
  const lastSeaLife = watch(`SeaLife.${lastIndex}`);

  const canSubmit = !!(lastSeaLife?.label?.trim());

  return (
    <S.ContentContainer insets={insets}>
      <ProgressBar currentStep={currentStep} totalSteps={steps} />

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
            trigger={trigger}
            datePickerVisible={datePickerVisible}
            showDatePicker={showDatePicker}
            hideDatePicker={() => {
              hideDatePicker();
              void trigger(["SightingDate"]);
            }}
          />
        )}

        {currentStep > 1 && currentStep <= images.length + 1 && (
          <StepX
            key={currentStep}
            image={images[currentStep - 2]}
            fieldIndex={currentStep - 2}
            control={control}
            watch={watch}
            errors={errors}
            getMoreAnimals={getMoreAnimals}
          />
        )}

        {currentStep === images.length + 2 && (
          <Step3
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        )}
      </ScrollView>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps}
        onBack={() => setCurrentStep(currentStep - 1)}
        onNext={handleGoNext}
        onSubmit={currentStep === 1 ? handleGoNext : onSubmit}
        isSubmitting={isSubmitting}
        canSubmit={canSubmit}
      />
    </S.ContentContainer>
  );
}