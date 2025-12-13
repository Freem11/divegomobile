import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { useUserProfile } from "../../../../store/user/useUserProfile";
import { RootStackParamList } from "../../../../providers/navigation";

import SiteSubmitterPageView from "./siteSubmitter";
import { Form } from "./form";

export default function SiteSubmitterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userProfile } = useUserProfile();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange",
    values: {
      Site: "",
      Latitude: 0,
      Longitude: 0
    }
  });

  console.log("Control inside SiteSubmitterScreen:", !!control); // Should be true

  const onSubmit = async (data: Form) => {
    console.log("data", data);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <SiteSubmitterPageView
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        setValue={setValue}
        isSubmitting={isSubmitting}
        errors={errors}
        watch={watch}
        isCompleted={isCompleted}
        trigger={trigger}
      />
    </View>
  );
}
