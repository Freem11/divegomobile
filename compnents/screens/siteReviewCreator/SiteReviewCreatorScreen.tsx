import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { insertReview, insertReviewConditions, insertReviewPhotos } from "../../../supabaseCalls/diveSiteReviewCalls/posts";
import { replaceReviewConditionsAtomic, replaceReviewPhotosAtomic } from "../../../supabaseCalls/diveSiteReviewCalls/atomics";
import { updateDiveSiteReview } from "../../../supabaseCalls/diveSiteReviewCalls/updates";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { ReviewConditionInsert } from "../../../entities/diveSiteReview";
import { DiveConditions } from "../../../entities/diveSiteCondidtions";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { RootStackParamList } from "../../../providers/navigation";
import { imageUploadMultiple } from "../imageUploadHelpers";
import { showError } from "../../toast";
import { getReviewPhotosByReviewId } from "../../../supabaseCalls/diveSiteReviewCalls/gets";
import { removePhotoReviews } from "../../cloudflareBucketCalls/cloudflareAWSCalls";

import SiteReviewPageView from "./siteReviewCreator";
import { Form } from "./form";
import { photoFateDeterminer, urlSanitizer } from "./photoManagment";

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
  if (unitSystem === "Imperial"){
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

  const tryUpload = async(uri: string, index: number) => {
    try {
      return await imageUploadMultiple({ assets: [{ uri }] }, index);
    } catch (e) {
      showError(e.message);
      console.error("Error uploading image:", e);
      return null;
    }
  };

  const formatConditions = (conditions: any[], reviewId: number): ReviewConditionInsert[] => {
    const filteredConditions = conditions.filter(c => c.value !== 0 || c.conditionId === DiveConditions.VISIBILITY);

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

    return finalConditions.map(condition => ({
      review_id: reviewId,
      condition_id: Number(condition.conditionId),
      value: condition.value
    }));
  };

  const handleCreate = async(data: Form) => {
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

  const handleUpdate = async(data: Form) => {

    const currentPhotos = (await getReviewPhotosByReviewId(reviewToEdit.review_id)).data;
    const newPhotos = data.Photos;

    const { deletes, uploads } = photoFateDeterminer(currentPhotos, newPhotos);

    const photoUploadPromises = uploads.map(async(photo, index) => {
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

    deletes.map(async(photo) => {
      try {
        const fileName = await removePhotoReviews(photo);

        if (!fileName) {
          throw new Error(t("PicUploader.failedUpload"));
        }
        return `animalphotos/public/${fileName}`;
      } catch (error) {
        console.error("Upload failed for a photo:", error);
        throw error;
      }
    });

    const uploadedFileNames = await Promise.all(photoUploadPromises);

    const { cleanUrls } = urlSanitizer(uploadedFileNames, data.Photos);
    data.Photos = [...cleanUrls];

    try {
      await updateDiveSiteReview(
        { dive_date: data.DiveDate, description: data.Description },
        reviewToEdit.review_id
      );

      const conditions = formatConditions(data.Conditions, reviewToEdit.review_id);
      await replaceReviewConditionsAtomic(reviewToEdit.review_id, conditions);

      const reviewPhotos = data.Photos.map(photo => ({
        review_id: reviewToEdit.review_id,
        photoPath: photo
      }));

      await replaceReviewPhotosAtomic(reviewToEdit.review_id, reviewPhotos);

    } catch (error) {
      console.error("Review update failed:", error);
      showError("Failed to update review");
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  };

  const onSubmit = async(data: Form) => {
    if (reviewToEdit) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  const getDiveSiteInfo = async(siteId: number) => {
    if (siteId){
      const diveSiteInfo = await getDiveSiteById(siteId);
      setSiteInfo(diveSiteInfo[0]);
    }
  };

  useEffect(() => {
    void getDiveSiteInfo(selectedDiveSite);
  }, [selectedDiveSite]);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
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
        isCompleted={isCompleted}
        trigger={trigger}
        existingPhotos={reviewToEdit?.photos}
      />
    </View>
  );
}
