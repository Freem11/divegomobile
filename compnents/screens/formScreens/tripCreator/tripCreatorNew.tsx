import React, { useState, useEffect, useCallback } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native";

import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { ReviewPhotos } from "../../../../entities/diveSiteReview";
import { ProgressBar } from "../progressBar";
import { StepNavigation } from "../stepNavigation";
import * as S from "../styles";
import { ItineraryItem } from "../../../../entities/itineraryItem";
import GoogleMap from "../../../googleMap";
import { useMapStore } from "../../../googleMap/useMapStore";
import { ScreenReturn } from "../../../googleMap/types";
import { useDiveShopNavigation } from "../../diveShop/types";

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
  sitesArray
}: ShopReviewCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const diveShopNavigation = useDiveShopNavigation();

  const handleMapFlip = async (formData: Required<Form>) => {
    setMapConfig(3, { pageName: ScreenReturn.TripCreator as unknown as string, itemId: 1 });
    diveShopNavigation.navigate("GoogleMap");
    setFormValues(formData);
  };

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
            values={{
              Name: selectedTrip?.tripName,
              Link: selectedTrip?.BookingPage,
              Price: selectedTrip?.price,
              Start: selectedTrip?.startDate,
              End: selectedTrip?.endDate,
              Details: selectedTrip?.description,
            }}
          />
        )}
        {currentStep === 2 && (
          <Step2
            watch={watch}
            control={control}
            errors={errors}
            values={{
              Name: selectedTrip?.tripName,
              Link: selectedTrip?.BookingPage,
              Price: selectedTrip?.price,
              Start: selectedTrip?.startDate,
              End: selectedTrip?.endDate,
              Details: selectedTrip?.description,
            }}
          />
        )}
        {currentStep === 3 && (
          <Step3
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
            tripDiveSites={tripDiveSites}
            handleMapFlip={handleMapFlip}
            removeFromSitesArray={removeFromSitesArray}
            sitesArray={sitesArray}
            values={{
              Name: selectedTrip?.tripName,
              Link: selectedTrip?.BookingPage,
              Price: selectedTrip?.price,
              Start: selectedTrip?.startDate,
              End: selectedTrip?.endDate,
              Details: selectedTrip?.description,
              SiteList: selectedTrip?.siteList
            }}
          />
        )}
        {currentStep === 4 && (
          <Step4 />
        )}
        {currentStep === 5 && (
          <GoogleMap />
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