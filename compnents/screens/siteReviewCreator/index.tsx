import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Import useForm here

import { UserProfileContext } from "../../contexts/userProfileContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { DiveConditions } from "../../../entities/diveSiteCondidtions";

import SiteReviewPageView from "./siteReviewCreator";
import { Form } from "./form";

type SiteReviewerProps = {
  selectedDiveSite: number
};

export default function SiteReviewCreatorPage(props: SiteReviewerProps) {

  const { profile } = useContext(UserProfileContext);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
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

  const onSubmit = async(data: Form) => {
    const filteredConditions = data.Conditions.filter(c =>
      c.value !== 0 || c.conditionId === DiveConditions.VISIBILITY
    );

    let finalConditions = filteredConditions;

    if (unitSystem === "Imperial") {
      finalConditions = filteredConditions.map(condition => {
        if (condition.conditionId === DiveConditions.VISIBILITY) {
          const convertedValue = condition.value * 0.3048;
          return {
            ...condition,
            value: Math.round(convertedValue)
          };
        }
        if (condition.conditionId === DiveConditions.CURRENT_INTENSITY) {
          const convertedValue = condition.value * 0.3048;
          return {
            ...condition,
            value: Math.round(convertedValue * 2) / 2
          };
        }
        return condition;
      });
    }

    const submissionData = {
      ...data,
      Conditions: finalConditions
    };

    console.log("Submitting final data:", submissionData);
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