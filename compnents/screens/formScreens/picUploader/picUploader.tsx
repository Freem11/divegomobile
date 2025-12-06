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
  unitSystem: string;
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
  existingPhotos
}: PicUploaderProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [steps, setSteps] = useState(2);

  useEffect(() => {
    setSteps(images.length + 2);
  }, [images]);

  const totalSteps = 2 + (images && images.length);

  const handleGoNext = useCallback(async () => {
    let fieldsToValidate: (keyof Form)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["SightingDate"];
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
      setCurrentStep(images.length + 1);
    }
  }, [isCompleted]);

  console.log("currentStep", currentStep);
  console.log("images", images.length);
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
            images={images}
            setImages={setImages}
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
            image={images[currentStep - 2]}
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
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </S.ContentContainer>
  );
}