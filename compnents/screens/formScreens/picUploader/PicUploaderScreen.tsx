import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { insertReview, insertReviewConditions, insertReviewPhotos } from "../../../../supabaseCalls/diveSiteReviewCalls/posts";
import { getDiveSiteById } from "../../../../supabaseCalls/diveSiteSupabaseCalls";
import { DiveConditions } from "../../../../entities/diveSiteCondidtions";
import { useUserProfile } from "../../../../store/user/useUserProfile";
import { RootStackParamList } from "../../../../providers/navigation";
import { imageUploadMultiple } from "../../imageUploadHelpers";
import { showError } from "../../../toast";

import PicUploaderPageView from "./picUploader";
import { Form } from "./form";

type PicUploaderScreenProps = {
  route: RouteProp<RootStackParamList, "SiteReviewCreator">;
};

export default function PicUploaderScreen({ route }: PicUploaderScreenProps) {
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

  const getDefaultValues = () => {
    if (reviewToEdit) {
      const formConditions = reviewToEdit.conditions?.map(condition => ({
        conditionId: condition.condition_type_id,
        value: condition.value
      })) || [
          { "conditionId": DiveConditions.CURRENT_INTENSITY, "value": 0 },
          { "conditionId": DiveConditions.VISIBILITY, "value": default_viz }
        ];

      return {
        DiveDate: reviewToEdit.dive_date || "",
        Conditions: formConditions,
        Description: reviewToEdit.description || "",
        Photos: reviewToEdit.photos?.map(photo => photo.photoPath) || []
      };
    }

    return {
      DiveDate: "",
      Conditions: [{ "conditionId": DiveConditions.CURRENT_INTENSITY, "value": 0 }, { "conditionId": DiveConditions.VISIBILITY, "value": default_viz }],
      Description: "",
      Photos: []
    };
  };

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    defaultValues: getDefaultValues(),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const tryUpload = async (uri: string, index: number) => {
    try {
      return await imageUploadMultiple({ assets: [{ uri }] }, index);
    } catch (e) {
      showError(e.message);
      console.error("Error uploading image:", e);
      return null;
    }
  };

  const handleCreate = async (data: Form) => {
    const photoUploadPromises = data.Photos.map(async (photo, index) => {
      try {
        const fileName = await tryUpload(photo, index);

        if (!fileName) {
          throw new Error(t("PicUploader.failedUpload"));
        }
        return fileName;
      } catch (error) {
        console.error("Upload failed for a photo:", error);
        throw error;
      }
    });

    try {
      const uploadedFileNames = await Promise.all(photoUploadPromises);
      const newPhotosArray = uploadedFileNames.map(fileName => (fileName));
      data.Photos = newPhotosArray;

      const reviewResult = await insertReview({
        created_by: userProfile.UserID,
        dive_date: data.DiveDate,
        description: data.Description,
        diveSite_id: selectedDiveSite
      });

      const reviewId = reviewResult.data[0].id;
      const conditions = formatConditions(data.Conditions, reviewId);

      await insertReviewConditions(conditions);

      const reviewPhotos = data.Photos.map(photo => ({
        review_id: reviewId,
        photoPath: photo
      }));

      await insertReviewPhotos(reviewPhotos);

    } catch (error) {
      console.error("Form submission failed due to photo upload errors:", error);
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  };

  const onSubmit = async (data: Form) => {
    await handleCreate(data);
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
      <PicUploaderPageView
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
        isCompleted={isCompleted}
        trigger={trigger}
        existingPhotos={reviewToEdit?.photos}
      />
    </View>
  );
}
