import React, { useEffect, useState } from "react";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { ImagePickerAsset } from "expo-image-picker";
import { useTranslation } from "react-i18next";

import { multiImageHandler } from "../../imageUploadHelpers";
import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";
import { Form } from "../form";
import * as S from "../styles";
import { ReviewPhotos } from "../../../../entities/diveSiteReview";

import { PhotoUpload } from "./photoUpload";

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
  const [images, setImages] = useState([]);

  const handleSelectImages = async() => {
    try {
      const result = await multiImageHandler();
      if (result?.assets?.[0]?.uri) {
        handlePreviewImages(result?.assets);
      }
    } catch (e: any) {
      console.log("Image selection cancelled", e.message);
    }
  };

  const handlePreviewImages = async(pictures: ImagePickerAsset[]) => {
    const newPicArray = pictures.map((picture) => ( picture.uri ));
    setImages((prevImages) => [...prevImages, ...newPicArray]);

    const currentFormPhotos = watch("Photos");
    setValue("Photos", [...currentFormPhotos, ...newPicArray]);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    setValue("Photos", updatedImages);
  };

  const imagesArray = [];
  images.forEach((image) => {
    imagesArray.push({ photofile: image });
  });

  useEffect(() => {
    const tempImagesArray = [];
    existingPhotos?.forEach((image) => {
      //prod url commented out and test url in in active place
      // imagesArray.push({ photofile: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${image.photoPath.split("/").pop()}` });
      imagesArray.push({ photofile: `https://pub-2c7837e6ce9144f5bba12fc08174562f.r2.dev/${image.photoPath.split("/").pop()}` });
      tempImagesArray.push(`https://pub-2c7837e6ce9144f5bba12fc08174562f.r2.dev/${image.photoPath.split("/").pop()}`);
      setImages([...images, ...tempImagesArray]);
    });
  },[]);

  return (
    <S.InputGroupContainer>
      <S.Title>{t("DiveSiteReviewer.step3Title")}</S.Title>
      <S.Subtitle style={{ marginBottom: moderateScale(12) }}>{t("DiveSiteReviewer.step3Description")}</S.Subtitle>

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

      <S.Title>{t("DiveSiteReviewer.addPhotos")}</S.Title>

      {imagesArray && imagesArray.length > 0 ? (
        <PhotoUpload
          items={imagesArray}
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
