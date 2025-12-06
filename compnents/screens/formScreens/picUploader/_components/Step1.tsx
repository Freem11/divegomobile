import React, { useEffect, useState } from "react";
import { View, Dimensions, Pressable } from "react-native";
import { Control, Controller, FieldErrors, UseFormWatch } from "react-hook-form";;
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { ImagePickerAsset } from "expo-image-picker";

import MobileTextInput from "../../../../reusables/textInput";
import * as S from "../../styles";
import { Form, FormRules } from "../form";
import { multiImageHandler } from "../../../imageUploadHelpers";
import Icon from "../../../../../icons/Icon";
import { colors } from "../../../../styles";
import { PhotoUpload } from "../../photoUpload";

interface Step1Props {
  control: Control<Form, any, Form>
  setValue: (name: keyof Form, value: any) => void
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  datePickerVisible: boolean
  showDatePicker: () => void
  hideDatePicker: () => void
  handleBooleanConditions: (buttonId: number, isMultiple?: boolean) => void
}

export const Step1: React.FC<Step1Props> = ({
  control,
  setValue,
  errors,
  watch,
  datePickerVisible,
  showDatePicker,
  hideDatePicker,
}) => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const screenWidth = Dimensions.get("window").width;

  const handleDatePickerConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setValue("SightingDate", formattedDate);
    hideDatePicker();
  };

  const handleSelectImages = async () => {
    try {
      const result = await multiImageHandler();
      if (result?.assets?.[0]?.uri) {
        handlePreviewImages(result?.assets);
      }
    } catch (e: any) {
      console.log("Image selection cancelled", e.message);
    }
  };

  const handlePreviewImages = async (pictures: ImagePickerAsset[]) => {
    const newPicArray = pictures.map((picture) => (picture.uri));
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
    setImages([...images]);
  }, []);

  return (
    <S.InputGroupContainer>
      <S.Title>{t("PicUploader.step1Title")}</S.Title>

      <S.MiniSpacer />

      <Controller
        control={control}
        name={"SightingDate"}
        rules={FormRules.SightingDate}
        render={({ field: { onChange, value } }) => (
          <Pressable onPress={() => showDatePicker()}>
            <View pointerEvents={"none"} style={{ width: screenWidth - moderateScale(32) }}>
              <MobileTextInput
                error={errors.SightingDate}
                iconLeft={"calendar-month"}
                placeholder={t("PicUploader.datePlaceholder")}
                onChangeText={onChange}
                value={value}
              />
            </View>
          </Pressable>
        )}
      />

      <S.Spacer />
      <S.MiniSpacer />

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

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode={"date"}
        date={new Date()}
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </S.InputGroupContainer>
  );
};
