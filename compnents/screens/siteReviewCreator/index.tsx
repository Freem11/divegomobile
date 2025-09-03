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
    console.log(data);
  };

  const getDiveSiteinfo = async(siteId: number) => {
    if (siteId){
      const diveSiteinfo = await getDiveSiteById(siteId);
      setSiteInfo(diveSiteinfo[0]);
    }
  };

  useEffect(() => {
    getDiveSiteinfo(props.selectedDiveSite);
  }, [props.selectedDiveSite]);

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