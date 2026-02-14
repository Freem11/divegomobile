import React, { useEffect, useState, useMemo } from "react";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { ImagePickerAsset } from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { styled } from "styled-components";

import { multiImageHandler } from "../../../imageUploadHelpers";
import Icon from "../../../../../icons/Icon";
import { activeFonts, colors } from "../../../../styles";
import { Form } from "../form";
import * as S from "../../styles";
import { ReviewPhotos } from "../../../../../entities/diveSiteReview";
import { cloudflareBucketUrl } from "../../../../globalVariables";
import { PhotoUpload } from "../../photoUpload";
import { Explainer } from "../../explainer";

interface Step3Props {
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  watch: UseFormWatch<Form>
  errors: FieldErrors<Form>
  existingPhotos: ReviewPhotos[]
}

export const Step3: React.FC<Step3Props> = ({
  control,
  setValue,
  watch,
  errors,
  existingPhotos
}) => {
  const { t } = useTranslation();

  // Initialize state with existing photos if they exist
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (existingPhotos && existingPhotos.length > 0) {
      const formattedExisting = existingPhotos.map(
        (img) => `${cloudflareBucketUrl}${img.photoPath.split("/").pop()}`
      );
      setImages(formattedExisting);
      setValue("Photos", formattedExisting);
    }
  }, [existingPhotos, setValue]);

  const handleSelectImages = async() => {
    try {
      const result = await multiImageHandler();
      if (result?.assets) {
        const newUris = result.assets.map((asset) => asset.uri);
        const updatedImages = [...images, ...newUris];

        setImages(updatedImages);
        setValue("Photos", updatedImages);
      }
    } catch (e: any) {
      console.log("Image selection cancelled", e.message);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    setValue("Photos", updatedImages);
  };

  // Memoize this to prevent unnecessary object creation on every render
  const imagesForUpload = useMemo(() =>
    images.map((uri) => ({ photofile: uri })),
  [images]);

  const popoverContent = () => {
    const Bold = styled(S.PopOverText)`
        font-family: ${activeFonts.Medium}
      `;

    return (
      <S.PopOver>
        <S.PopOverText>
          Photos attached to your review may be eligible for special bonuses!
          {"\n"}
          {"\n"}
          1) Sea life photos can be <Bold>promoted to Sea Life Sightings</Bold> by our team.
          {"\n"}
          {"\n"}
          2) Dive site photos that capture the location perfectly <Bold>may be selected as the Official Header Photo for that site.</Bold>
        </S.PopOverText>
      </S.PopOver >
    );
  };

  return (
    <S.InputGroupContainer>
      <S.Title>{t("DiveSiteReviewer.step3Title")}</S.Title>
      <S.Subtitle style={{ marginBottom: moderateScale(12) }}>
        {t("DiveSiteReviewer.step3Description")}
      </S.Subtitle>

      <S.DescriptionBox>
        <Controller
          control={control}
          name={"Description"}
          render={({ field: { onChange, value } }) => (
            <S.MultilineTextInput
              multiline
              error={errors.Description}
              placeholderTextColor={colors.neutralGrey}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </S.DescriptionBox>

      <S.Title>{t("DiveSiteReviewer.addPhotos")}
        <Explainer popoverContent={popoverContent} iconSize={20} />
      </S.Title>

      {imagesForUpload.length > 0 ? (
        <PhotoUpload
          items={imagesForUpload}
          onAddSighting={handleSelectImages}
          onRemovePhoto={handleRemovePhoto}
        />
      ) : (
        <S.EmptyStateContainer onPress={handleSelectImages}>
          <Icon
            name={"camera-plus"}
            color={colors.borderActive}
            width={moderateScale(50)}
            height={moderateScale(50)}
          />
        </S.EmptyStateContainer>
      )}
    </S.InputGroupContainer>
  );
};