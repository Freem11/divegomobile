import React, { useContext, useEffect, useState } from "react";

import { UserProfileContext } from "../../contexts/userProfileContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";

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

  const onSubmit = async(formData: Required<Form>) => {};

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
      onSubmit={() => onSubmit}
      values={null}
      selectedDiveSite={siteInfo}
    />
  );
}