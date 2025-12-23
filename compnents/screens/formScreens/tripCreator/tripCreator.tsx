import React, { useState, useEffect, useCallback } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-matter-size-matters"; // Note: Check if this was a typo in original (usually react-native-size-matters)
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { ProgressBar } from "../progressBar";
import { StepNavigation } from "../stepNavigation";
import * as S from "../styles";
import { ItineraryItem } from "../../../../entities/itineraryItem";

import { Step1, Step2, Step3, Step4 } from "./_components";
import { Form } from "./form";

type ShopReviewCreatorProps = {
  datePickerVisible: boolean;
  dateType: string;
  showDatePicker: (value: string) => void;
  hideDatePicker: () => void;
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  isSubmitting: boolean
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  onSubmit: () => void;
  isCompleted?: boolean;
  trigger: UseFormTrigger<Form>;
  selectedTrip: ItineraryItem;
  tripDiveSites: DiveSiteWithUserName[];
  removeFromSitesArray: (siteIdNo: number, siteList: number[]) => void;
  sitesArray: number[];
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  useMapFlip: () => void; // This is the logic from the Screen
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
  selectedTrip,
  tripDiveSites,
  removeFromSitesArray,
  sitesArray,
  editMode,
  setEditMode,
  useMapFlip
}: ShopReviewCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const insets = useSafeAreaInsets();

  const handleGoNext = useCallback(async () => {
    let fieldsToValidate: (keyof Form)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["Name", "Link", "Price", "Start", "End"];
        break;
      case 2:
        fieldsToValidate = ["Details"];
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
            dateType={dateType}
            errors={errors}
            watch={watch}
            editMode={editMode}
            setEditMode={setEditMode}
            datePickerVisible={datePickerVisible}
            showDatePicker={showDatePicker}
            hideDatePicker={() => {
              hideDatePicker();
              void trigger(["Start", "End"]);
            }}
            values={{
              Id: selectedTrip?.id,
              Name: watch("Name"),
              Link: watch("Link"),
              Price: watch("Price"),
              Start: watch("Start"),
              End: watch("End"),
              Details: watch("Details"),
            }}
          />
        )}
        {currentStep === 2 && (
          <Step2
            watch={watch}
            control={control}
            errors={errors}
            editMode={editMode}
            setEditMode={setEditMode}
            values={{
              Id: selectedTrip?.id,
              Name: watch("Name"),
              Details: watch("Details"),
            }}
          />
        )}
        {currentStep === 3 && (
          <Step3
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
            editMode={editMode}
            setEditMode={setEditMode}
            tripDiveSites={tripDiveSites}
            handleMapFlip={useMapFlip}
            removeFromSitesArray={removeFromSitesArray}
            sitesArray={sitesArray}
            values={{
              Id: selectedTrip?.id,
              Name: watch("Name"),
              SiteList: sitesArray
            }}
          />
        )}
        {currentStep === 4 && (
          <Step4 editMode={editMode} />
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