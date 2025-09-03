import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import { View, Animated } from "react-native";
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
import ReusableSlider from "../../reusables/slider";

import * as S from "./styles";
import { Form, FormRules } from "./form";

type ShopReviewCreatorProps = {
  values: Form;
  datePickerVisible: boolean;
  showDatePicker: () => void;
  hideDatePicker: () => void;
  onSubmit: (data: any) => void
  selectedDiveSite: DiveSiteWithUserName
  unitSystem: string
};

export default function SiteReviewPageView({
  values,
  datePickerVisible,
  showDatePicker,
  hideDatePicker,
  onSubmit,
  selectedDiveSite,
  unitSystem
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

  const [visibility, setVisibility] = useState(0);
  const [currentIntensity, SetCurrentIntensity] = useState(0.0);

  const [showCurrentButtons, setShowCurrentButtons] = useState(false);
  const [heightAnim] = useState(new Animated.Value(0));

  const [metrics, setMetrics] = useState(unitSystem === "Imperial" ? {
    highValueViz: 100,
    lowValueViz: 0,
    highValueCur: 6.5,
    lowValueCur: 0,
    simpleMetric: "ft",
    rateMetric: "ft/s"
  } : {
    highValueViz: 30,
    lowValueViz: 0,
    highValueCur: 2,
    lowValueCur: 0,
    simpleMetric: "m",
    rateMetric: "m/s"
  });

  const handleOnSubmit = (data: Form) => {
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

        <S.Buffer/>

        <Label label={t("DiveSiteReviewer.typOfDive")}  />
        {/* Type Of Dive Toggles goes here */}

        <S.TypeOfDiveButtons>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.shoreDiveButton")}
              iconLeft={"island"}
              alt
              round={false}
              onPress={() => null}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.boatDiveButton")}
              iconLeft={"sailboat"}
              alt
              round={false}
              onPress={() => null}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.nightDiveButton")}
              iconLeft={"moon-stars"}
              alt
              round={false}
              onPress={() => null}
            />
          </S.ButtonRow>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.altitudeDiveButton")}
              iconLeft={"mountains"}
              alt
              round={false}
              onPress={() => null}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.wreckDiveButton")}
              iconLeft={"directions-boat"}
              alt
              round={false}
              onPress={() => null}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.caveDiveButton")}
              iconLeft={"vinyl-record"}
              alt
              round={false}
              onPress={() => null}
            />
          </S.ButtonRow>
        </S.TypeOfDiveButtons>

        <Label label={t("DiveSiteReviewer.typeOfWater")} />
        {/* Type of WaterToggles goes here */}
        <S.WaterTypeButtons>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.saltWaterButton")}
              iconLeft={"salt-water"}
              alt
              round={false}
              onPress={() => null}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.freshWaterButton")}
              iconLeft={"fresh-water"}
              alt
              round={false}
              onPress={() => null}
            />
          </S.ButtonRow>
        </S.WaterTypeButtons>

        <Label label={t("DiveSiteReviewer.atTheSurface")} />
        {/* At The Surface Toggles goes here */}
        <S.AttheSurfaceButtons>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.trafficButton")}
              iconLeft={"traffic-light"}
              alt
              round={false}
              onPress={() => null}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.surgeButton")}
              iconLeft={"waves"}
              alt
              round={false}
              onPress={() => null}
            />
          </S.ButtonRow>
        </S.AttheSurfaceButtons>

        <Label label={t("DiveSiteReviewer.inTheWater")} />

        {/* In the Water Toggles goes here */}

        <S.InTheWaterButtons>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.noRefsButton")}
              iconLeft={"GPS-splash"}
              alt
              round={false}
              onPress={() => null}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.limitsButton")}
              iconLeft={"warning-diamond"}
              alt
              round={false}
              onPress={() => null}
            />
          </S.ButtonRow>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.kelpButton")}
              iconLeft={"coral"}
              alt
              round={false}
              onPress={() => null}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.pollutionButton")}
              iconLeft={"beer-bottle"}
              alt
              round={false}
              onPress={() => null}
            />
          </S.ButtonRow>
        </S.InTheWaterButtons>

        {/* Viz Slider goes here */}
        <ReusableSlider
          inverted
          title={<S.Label>{t("DiveSiteReviewer.viz")}</S.Label>}
          leftValue={metrics.lowValueViz}
          rightValue={metrics.highValueViz}
          unitMeasurement={metrics.simpleMetric}
          onValueChange={(value) => setVisibility(value)}
        />

        {/* Current Slider goes here */}
        <ReusableSlider
          title={<S.Label>{t("DiveSiteReviewer.current")}</S.Label>}
          leftValue={metrics.lowValueCur}
          rightValue={metrics.highValueCur}
          unitMeasurement={metrics.rateMetric}
          onValueChange={(value) => SetCurrentIntensity(value)}
        />

        {showCurrentButtons && (
          <Animated.View style={{ height: heightAnim, overflow: "hidden", marginBottom: moderateScale(20) }}>
            <S.Label>{t("DiveSiteReviewer.currentDirection")}</S.Label>
            <S.CurrentButtons>
              <S.ButtonRow>
                <S.StyledButton
                  size={"thin"}
                  title={t("DiveSiteReviewer.latCurrentButton")}
                  iconLeft={"arrow-left-right"}
                  alt
                  round={false}
                  onPress={() => null}
                />
                <S.StyledButton
                  size={"thin"}
                  title={t("DiveSiteReviewer.upCurrentButton")}
                  iconLeft={"circle-arrow-up"}
                  alt
                  round={false}
                  onPress={() => null}
                />
              </S.ButtonRow>
              <S.ButtonRow>
                <S.StyledButton
                  size={"thin"}
                  title={t("DiveSiteReviewer.downCurrentButton")}
                  iconLeft={"circle-arrow-down"}
                  alt
                  round={false}
                  onPress={() => null}
                />
                <S.StyledButton
                  size={"thin"}
                  title={t("DiveSiteReviewer.contrastCurrentButton")}
                  iconLeft={"arrow-left-right-reverse"}
                  alt
                  round={false}
                  onPress={() => null}
                />
              </S.ButtonRow>
            </S.CurrentButtons>
          </Animated.View>
        )}

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