import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { insertPhotoWaits } from "../../../../supabaseCalls/seaLifePhotoCalls/posts";
import { getDiveSiteById } from "../../../../supabaseCalls/diveSiteSupabaseCalls";
import { useUserProfile } from "../../../../store/user/useUserProfile";
import { RootStackParamList } from "../../../../providers/navigation";
import { imageUploadMultiple } from "../../imageUploadHelpers";
import { showError } from "../../../toast";
import { DynamicSelectOptionsAnimals } from "../../../../entities/DynamicSelectOptionsAnimals";

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

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const tryUpload = async(uri: string, index: number) => {
    try {
      return await imageUploadMultiple({ assets: [{ uri }] }, index);
    } catch (e: any) {
      showError(e.message);
      console.error("Error uploading image:", e);
      return null;
    }
  };

  const handleCreate = useCallback(async(data: Form) => {
    const photoUploadPromises = data.Photos.map(async(photo, index) => {
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

      const seaLifePhotoRecords = data.SeaLife.map((record, index) => ({
        label: record.label,
        dateTaken: data.SightingDate,
        UserID: userProfile.UserID,
        latitude: selectedDiveSite.lat,
        longitude: selectedDiveSite.lng,
        photoFile: `animalphotos/public/${uploadedFileNames[index]}`
      }));

      await insertPhotoWaits(seaLifePhotoRecords);

    } catch (error) {
      console.error("Form submission failed due to photo upload errors:", error);
      showError(t("Error during review creation."));
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  }, [userProfile.UserID, selectedDiveSite, siteInfo, t, setIsCompleted, navigation, tryUpload]);

  const onSubmit = useCallback(async(data: Form) => {
    if (data.Photos.length !== 0) {
      await handleCreate(data);
    }
  }, [handleCreate]);

  const showDatePicker = useCallback(() => setDatePickerVisible(true), []);
  const hideDatePicker = useCallback(() => setDatePickerVisible(false), []);

  const getDiveSiteInfo = async(siteId: number) => {
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
        showDatePicker={showDatePicker}
        hideDatePicker={hideDatePicker}
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
        getMoreAnimals={DynamicSelectOptionsAnimals.getMoreOptions}
      />
    </View>
  );
}