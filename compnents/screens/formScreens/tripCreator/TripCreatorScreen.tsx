import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { insertReview, insertReviewConditions, insertReviewPhotos } from "../../../../supabaseCalls/diveSiteReviewCalls/posts";
import { replaceReviewConditionsAtomic, replaceReviewPhotosAtomic } from "../../../../supabaseCalls/diveSiteReviewCalls/atomics";
import { updateDiveSiteReview } from "../../../../supabaseCalls/diveSiteReviewCalls/updates";
import { getDiveSiteById } from "../../../../supabaseCalls/diveSiteSupabaseCalls";
import { ReviewConditionInsert } from "../../../../entities/diveSiteReview";
import { DiveConditions } from "../../../../entities/diveSiteCondidtions";
import { useUserProfile } from "../../../../store/user/useUserProfile";
import { RootStackParamList } from "../../../../providers/navigation";
import { imageUploadMultiple } from "../../imageUploadHelpers";
import { showError } from "../../../toast";
import { getReviewPhotosByReviewId } from "../../../../supabaseCalls/diveSiteReviewCalls/gets";
import { removePhotoReviews } from "../../../cloudflareBucketCalls/cloudflareAWSCalls";

import SiteReviewPageView from "./siteReviewCreator";
import { Form } from "./form";
import { photoFateDeterminer, urlSanitizer } from "./photoManagment";
import TripCreatorPageView from "./tripCreator";

type SiteReviewCreatorScreenProps = {
  route: RouteProp<RootStackParamList, "SiteReviewCreator">;
};

export default function SiteReviewCreatorScreen({ route }: SiteReviewCreatorScreenProps) {
  const { selectedDiveSite, reviewToEdit } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userProfile } = useUserProfile();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const unitSystem = userProfile && userProfile.unit_system;

  let default_viz = 30;
  if (unitSystem === "Imperial") {
    default_viz = 100;
  }

  const [dateType, setDateType] = useState("");

  const showDatePicker = (value: string) => {
    setDateType(value);
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const handleCreate = async (data: Form) => {

    try {
      //code

    } catch (error) {
      console.error("Form submission failed due to photo upload errors:", error);
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  };

  const handleUpdate = async (data: Form) => {

    try {
      //code

    } catch (error) {
      console.error("Trip update failed:", error);
      showError("Failed to update trip");
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  };

  const onSubmit = async (data: Form) => {
    if (reviewToEdit) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  const getDiveSiteInfo = async (siteId: number) => {
    if (siteId) {
      const diveSiteInfo = await getDiveSiteById(siteId);
      setSiteInfo(diveSiteInfo[0]);
    }
  };

  useEffect(() => {
    void getDiveSiteInfo(selectedDiveSite);
  }, [selectedDiveSite]);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <TripCreatorPageView
        datePickerVisible={datePickerVisible}
        dateType={dateType}
        showDatePicker={showDatePicker}
        hideDatePicker={hideDatePicker}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        setValue={setValue}
        isSubmitting={isSubmitting}
        errors={errors}
        watch={watch}
        selectedDiveSite={siteInfo}
        unitSystem={unitSystem}
        isCompleted={isCompleted}
        trigger={trigger}
        existingPhotos={reviewToEdit?.photos}
      />
    </View>
  );
}
