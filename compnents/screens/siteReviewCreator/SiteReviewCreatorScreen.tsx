import type { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { insertReview, insertReviewConditions, insertReviewPhotos } from "../../../supabaseCalls/diveSiteReviewCalls/posts";
import { updateDiveSiteReview } from "../../../supabaseCalls/diveSiteReviewCalls/updates";
import { RootStackParamList } from "../../../providers/navigation";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { DiveConditions } from "../../../entities/diveSiteCondidtions";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { imageUploadMultiple } from "../imageUploadHelpers";
import SiteReviewPageView from "./siteReviewCreator";
import { showError } from "../../toast";
import { Form } from "./form";

type SiteReviewCreatorScreenProps = {
  route: RouteProp<RootStackParamList, 'SiteReviewCreator'>;
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
    mode: 'onChange',
    reValidateMode: 'onChange'
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

      let diveReviewId;

      if (reviewToEdit) {
        await updateDiveSiteReview({
          dive_date: submissionData.DiveDate,
          description: submissionData.Description,
        }, reviewToEdit.id);
        
        diveReviewId = reviewToEdit.id;
      } else {
        const sucessfulReviewInsert = await insertReview({
          created_by: userProfile.UserID,
          dive_date: submissionData.DiveDate,
          description: submissionData.Description,
          diveSite_id: selectedDiveSite
        });

        diveReviewId = sucessfulReviewInsert.data[0].id;

        const reviewConditions = submissionData.Conditions.map(condition => {
          return {
            review_id: diveReviewId,
            condition_id: condition.conditionId,
            value: condition.value
          };
        });

        await insertReviewConditions(reviewConditions);

        const reviewPhotos = submissionData.Photos.map(photo => {
          return {
            review_id: diveReviewId,
            photoPath: photo
          };
        });

        await insertReviewPhotos(reviewPhotos);
      }

      setIsCompleted(true);
      
      setTimeout(() => {
        navigation.goBack();
      }, 3000);

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

  getDiveSiteinfo(selectedDiveSite);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
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
      />
    </View>
  )
}
