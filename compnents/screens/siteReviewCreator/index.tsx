import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { UserProfileContext } from "../../contexts/userProfileContext";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { DiveConditions } from "../../../entities/diveSiteCondidtions";
import { imageUploadMultiple } from "../imageUploadHelpers";
import { showError } from "../../toast";

import SiteReviewPageView from "./siteReviewCreator";
import { Form } from "./form";

type SiteReviewerProps = {
  selectedDiveSite: number
};

export default function SiteReviewCreatorPage(props: SiteReviewerProps) {
  const { t } = useTranslation();
  const { profile } = useContext(UserProfileContext);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);

  const unitSystem = profile && profile.unit_system;
  // const unitSystem = "Imperial";

  let default_viz = 30;
  if (unitSystem === "Imperial"){
    default_viz = 100;
  }

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<Form>({
    defaultValues: {
      DiveDate: "",
      Conditions: [{ "conditionId": DiveConditions.CURRENT_INTENSITY, "value": 0 }, { "conditionId": DiveConditions.VISIBILITY, "value": default_viz }],
      Description: "",
      Photos: []
    }
  });

  const tryUpload = async(uri: string, index: number) => {
    try {
      return await imageUploadMultiple({ assets: [{ uri }] }, index);
    } catch (e) {
      showError(e.message);
      console.error("Error uploading image:", e);
      return null;
    }
  };

  const onSubmit = async(data: Form) => {

    console.log("Submitting pre data:", data);

    const photoUploadPromises = data.Photos.map(async(photo, index) => {
      try {
        const fileName = await tryUpload(photo, index);

        if (!fileName) {
          throw new Error(t("PicUploader.failedUpload"));
        }
        return `animalphotos/public/${fileName}`;
      } catch (error) {
        console.error("Upload failed for a photo:", error);
        throw error;
      }
    });

    try {
      const uploadedFileNames = await Promise.all(photoUploadPromises);
      const newPhotosArray = uploadedFileNames.map(fileName => (fileName));
      data.Photos = newPhotosArray;

      const filteredConditions = data.Conditions.filter(c => c.value !== 0 || c.conditionId === DiveConditions.VISIBILITY);

      let finalConditions = filteredConditions;
      if (unitSystem === "Imperial") {
        finalConditions = filteredConditions.map(condition => {
          if (condition.conditionId === DiveConditions.VISIBILITY) {
            const convertedValue = condition.value * 0.3048;
            return { ...condition, value: Math.round(convertedValue) };
          }
          if (condition.conditionId === DiveConditions.CURRENT_INTENSITY) {
            const convertedValue = condition.value * 0.3048;
            return { ...condition, value: Math.round(convertedValue * 2) / 2 };
          }
          return condition;
        });
      }

      const submissionData = {
        ...data,
        Conditions: finalConditions
      };

      console.log("Submitting final data:", submissionData);

    } catch (error) {
      console.error("Form submission failed due to photo upload errors:", error);
    }
  };

  const getDiveSiteinfo = async(siteId: number) => {
    if (siteId){
      const diveSiteinfo = await getDiveSiteById(siteId);
      setSiteInfo(diveSiteinfo[0]);
    }
  };

  getDiveSiteinfo(props.selectedDiveSite);

  return (
    <SiteReviewPageView
      datePickerVisible={datePickerVisible}
      showDatePicker={() => setDatePickerVisible(true)}
      hideDatePicker={() => setDatePickerVisible(false)}
      onSubmit={handleSubmit(onSubmit)}
      control={control}
      setValue={setValue}
      isSubmitting={isSubmitting}
      errors={errors}
      watch={watch}
      selectedDiveSite={siteInfo}
      unitSystem={unitSystem}
    />
  );
}