import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Control, Controller, FieldErrors, useForm, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { ImagePickerAsset } from "expo-image-picker";

import { multiImageHandler } from "../../imageUploadHelpers";
import { PhotoUpload } from "../../formScreens/photoUpload";
import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";

import * as S from "./styles";
import { Form } from "./form";
import { processPhotosForSync } from "./calibrator";

interface PhotoUploaderProps {
  control: Control<Form, any, Form>;
  setValue: (name: keyof Form, value: any) => void;
  errors: FieldErrors<Form>;
  watch: UseFormWatch<Form>;
  trigger: UseFormTrigger<Form>;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
}) => {
  const { t } = useTranslation();
  const [isCalibrating, setIsCalibrating] = useState(false);
  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const photosArrayInForm: string[] = watch("Photos") || [];
  const sightingsMetadata = watch("SightingsMetadata") || [];
  const syncOffset = watch("SyncOffset") || 0;

  const handleSelectImages = async () => {
    try {
      const result = await multiImageHandler();
      if (result?.assets?.length) {
        await handlePreviewImages(result.assets);
      }
    } catch (e: any) {
      console.log("Selection cancelled", e.message);
    }
  };

  const handlePreviewImages = async (pictures: ImagePickerAsset[]) => {
    // Phase 1: Show thumbnails immediately
    const quickURIs = pictures.map((p) => p.uri);
    const currentPhotos = watch("Photos") || [];
    setValue("Photos", [...currentPhotos, ...quickURIs]);
    void trigger(["Photos"]);

    // Phase 2: Calibration (Resized & Fast)
    setIsCalibrating(true);
    try {
      const { photos, offset } = await processPhotosForSync(pictures);
      const currentMetadata = watch("SightingsMetadata") || [];

      setValue("SightingsMetadata", [...currentMetadata, ...photos]);
      setValue("SyncOffset", offset);
    } catch (err) {
      console.error("Calibration error", err);
    } finally {
      setIsCalibrating(false);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const updatedImages = photosArrayInForm.filter((_, i) => i !== indexToRemove);
    const updatedMetadata = sightingsMetadata.filter((_, i) => i !== indexToRemove);
    setValue("Photos", updatedImages);
    setValue("SightingsMetadata", updatedMetadata);
    void trigger(["Photos"]);
  };

  return (
    <S.InputGroupContainer>
      <S.Title>{t("PicUploader.addPhotos")}</S.Title>

      <Controller
        control={control}
        name="Photos"
        render={() => <View style={{ height: 0, opacity: 0 }} />}
      />

      {photosArrayInForm.length > 0 ? (
        <PhotoUpload
          items={photosArrayInForm.map(uri => ({ photofile: uri }))}
          onAddSighting={handleSelectImages}
          onRemovePhoto={handleRemovePhoto}
        />
      ) : (
        <S.EmptyStateContainer onPress={handleSelectImages}>
          <Icon name="camera-plus" color={colors.borderActive} width={moderateScale(50)} height={moderateScale(50)} />
        </S.EmptyStateContainer>
      )}

      {isCalibrating && (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15, padding: 10, backgroundColor: colors.primaryBlue + "10", borderRadius: 8 }}>
          <ActivityIndicator size="small" color={colors.primaryBlue} />
          <Text style={{ marginLeft: 10, fontSize: 10, color: colors.primaryBlue, fontWeight: "700" }}>
            SYNCING PHOTOS TO ATOMIC CLOCK...
          </Text>
        </View>
      )}

      {sightingsMetadata.length > 0 && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 10, marginBottom: 8, color: colors.primaryBlue }}>
            SYNC LOG (DRIFT: {Math.round(syncOffset / 1000)}s)
          </Text>
          {sightingsMetadata.map((item, index) => (
            <View key={index} style={{ marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 9, color: "red" }}>
                  OLD: {new Date(item.oldDate).toLocaleString()}
                </Text>
                <Text style={{ fontSize: 9, color: "green", fontWeight: "700" }}>
                  NEW: {new Date(item.newDate).toLocaleString()}
                </Text>
              </View>
              {item.isAnchor && <Text style={{ fontSize: 9, color: colors.primaryBlue, fontWeight: "800" }}>🎯 ANCHOR</Text>}
            </View>
          ))}
        </View>
      )}

      {errors.Photos?.message && <S.ErrorText>{errors.Photos.message}</S.ErrorText>}
    </S.InputGroupContainer>
  );
};