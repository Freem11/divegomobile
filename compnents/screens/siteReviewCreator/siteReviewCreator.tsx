import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import { View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { moderateScale } from "react-native-size-matters";
import { ImagePickerAsset } from "expo-image-picker";

import Label from "../../reusables/label";
import { colors } from "../../styles";
import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { PreviewGrid } from "../../reusables/previewGrid";
import EmptyState from "../../reusables/emptyState-new";
import { multiImageHandler } from "../imageUploadHelpers";

import * as S from "./styles";
import { Form, FormRules } from "./form";

type ShopReviewCreatorProps = {
  values: Form;
  datePickerVisible: boolean;
  showDatePicker: () => void;
  hideDatePicker: () => void;
  onSubmit: (data: any) => void
  selectedDiveSite: DiveSiteWithUserName
};

export default function SiteReviewPageView({
  values,
  datePickerVisible,
  showDatePicker,
  hideDatePicker,
  onSubmit,
  selectedDiveSite
}: ShopReviewCreatorProps) {
  const [images, setImages] = useState([]);

  const { control, setValue, handleSubmit, formState: { isSubmitting, errors } } = useForm<Form>({
    values: values
  });

  const handleDatePickerConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setValue("DiveDate", formattedDate);
    hideDatePicker();
  };

  const { t } = useTranslation();

  const handleOnSubmit = (data: Form) => {
    // toast.dismiss();
    onSubmit(data);
  };

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
    const newPicArray = pictures.map((picture) => ({ photofile: picture.uri }));

    setImages((prevImages) => [...prevImages, ...newPicArray]);
  };

  return (
    <S.ContentContainer>
      {selectedDiveSite &&
      <S.Header>{t("DiveSiteReviewer.header", { siteName: selectedDiveSite.name })}</S.Header>}

      <S.InputGroupContainer>

        <Label label={t("DiveSiteReviewer.diveDate")} />
        <Controller
          control={control}
          name="DiveDate"
          rules={FormRules.DiveDate}
          render={({ field: { onChange, value } }) => (
            <S.TextBuffer>
              <Toucher onPress={() => showDatePicker()}>
                <View pointerEvents="none">
                  <MobileTextInput
                    error={errors.DiveDate}
                    iconLeft="calendar-month"
                    placeholder={t("DiveSiteReviewer.datePlaceholder")}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              </Toucher>
            </S.TextBuffer>
          )}
        />

        <Label label={t("DiveSiteReviewer.typOfDive")}  />
        {/* Type Of Dive Toggles goes here */}

        <Label label={t("DiveSiteReviewer.atTheSurface")} />
        {/* At The Surface Toggles goes here */}

        <Label label={t("DiveSiteReviewer.inTheWater")} />
        {/* Viz Slider goes here */}

        {/* Current Slider goes here */}

        {/* Current Toggles goes here */}

        {/* In the Water Toggles goes here */}

        <Label label={t("DiveSiteReviewer.title")}  />

        <Label label={t("DiveSiteReviewer.details")} />
        <Controller
          control={control}
          name="DiveTitle"
          rules={FormRules.DiveTitle}
          render={({ field: { onChange, value } }) => (
            <S.TextBuffer>
              <MobileTextInput
                error={errors.DiveTitle}
                iconLeft="pencil"
                placeholder={t("DiveSiteReviewer.reviewNamePlaceholder")}
                onChangeText={onChange}
                value={value}
              />
            </S.TextBuffer>
          )}
        />

        <Label label={t("DiveSiteReviewer.description")} />

        {selectedDiveSite && (
          <S.DescriptionBox>
            <Controller
              control={control}
              name="Description"
              rules={FormRules.Description}
              render={({ field: { onChange, value } }) => (
                <S.MultilineTextInput
                  multiline
                  error={errors.Description}
                  placeholder={t("DiveSiteReviewer.reviewDescriptionPlaceholder", { siteName: selectedDiveSite.name }).replace(/\\n/g, "\n")}
                  placeholderTextColor={colors.neutralGrey}
                  onChangeText={onChange}
                  value={value}
                >
                </S.MultilineTextInput>
              )}
            />
          </S.DescriptionBox>
        )}

        <Label label={t("DiveSiteReviewer.addPhotos")} />
        {/* Multi Pic Uploader goes here */}

      </S.InputGroupContainer>

      {images && images.length > 0 ? (
        <S.PhotosContainer>
          <PreviewGrid items={images} onAddSighting={handleSelectImages} buttonText="Add Dive Photos" />
        </S.PhotosContainer>
      ) : (
        <S.EmptyStateContainer>
          <EmptyState
            iconName="camera-plus"
            title={"You haven't added any photos to your review yet"}
            subtitle={"Any photos you add will be considered for sea life sightings as well as the dive site's header photo!"}
          />
          <Button
            size="thin"
            title={"Add Dive Photos"}
            iconLeft="camera-plus"
            round={false}
            style={{ width: "auto", marginTop: moderateScale(15) }}
            onPress={handleSelectImages}
          />

        </S.EmptyStateContainer>
      )}

      <S.ButtonBox>
        <Button
          onPress={handleSubmit(handleOnSubmit)}
          alt={false}
          size="medium"
          title={t("PicUploader.submitButton")}
          iconRight="chevron-right"
        />
      </S.ButtonBox>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        date={new Date()}
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </S.ContentContainer>
  );
}
