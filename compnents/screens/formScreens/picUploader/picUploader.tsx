import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";

import { ProgressBar } from "../progressBar";
import { StepNavigation } from "../stepNavigation";
import * as S from "../styles";

import { Step1, StepX, Step3 } from "./_components";

export default function PicUploaderPageView({
  control, setValue, watch, getValues, trigger, errors, isSubmitting, onSubmit,
  datePickerVisible, showDatePicker, hideDatePicker, runAIForIndex,
  selectedDiveSite, isCompleted, getMoreAnimals, seaLifeFields
}: any) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const photos = watch("Photos") || [];
  const steps = photos.length + 2;

  useEffect(() => {
    if (isCompleted) setCurrentStep(currentStep + 1);
  }, [isCompleted]);

  return (
    <S.ContentContainer insets={insets}>
      <ProgressBar currentStep={currentStep} totalSteps={steps} />

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingBottom: moderateScale(120) }}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
      >
        {currentStep === 1 && (
          <Step1
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
            trigger={trigger}
            datePickerVisible={datePickerVisible}
            showDatePicker={showDatePicker}
            hideDatePicker={hideDatePicker}
            selectedDiveSite={selectedDiveSite}
          />
        )}

        {currentStep > 1 && currentStep <= photos.length + 1 && (
          <StepX
            key={seaLifeFields[currentStep - 2]?.id}
            image={photos[currentStep - 2]}
            fieldIndex={currentStep - 2}
            control={control}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
            runAIForIndex={runAIForIndex}
            getMoreAnimals={getMoreAnimals}
          />
        )}

        {currentStep === photos.length + 2 && (
          <Step3 control={control} setValue={setValue} watch={watch} errors={errors} />
        )}
      </ScrollView>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps}
        onBack={() => setCurrentStep(currentStep - 1)}
        onNext={async () => {
          const field = currentStep === 1 ? ["SightingDate", "Photos"] : [`SeaLife.${currentStep - 2}`];
          const isValid = await trigger(field);
          if (isValid) setCurrentStep(currentStep + 1);
        }}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        canSubmit={!!watch(`SeaLife.${photos.length - 1}`)?.label}
      />
    </S.ContentContainer>
  );
}