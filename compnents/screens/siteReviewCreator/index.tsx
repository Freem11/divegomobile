import React, { useContext, useState } from "react";

import { UserProfileContext } from "../../contexts/userProfileContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";

import SiteReviewPageView from "./siteReviewCreator";
import { Form } from "./form";

export default function SiteReviewCreatorPage() {

  const { profile } = useContext(UserProfileContext);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const onSubmit = async(formData: Required<Form>) => {};

  return (
    <SiteReviewPageView
      datePickerVisible={datePickerVisible}
      showDatePicker={() => setDatePickerVisible(true)}
      hideDatePicker={() => setDatePickerVisible(false)}
      onSubmit={() => onSubmit}
      values={null}
    />
  );
}