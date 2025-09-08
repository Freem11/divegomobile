import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
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
import { DiveConditions } from "../../../entities/diveSiteCondidtions";

import * as S from "./styles";
import { Form, FormRules } from "./form";

type ShopReviewCreatorProps = {
  datePickerVisible: boolean;
  showDatePicker: () => void;
  hideDatePicker: () => void;
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  isSubmitting: boolean
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  onSubmit: () => void;
  selectedDiveSite: DiveSiteWithUserName;
  unitSystem: string;
};

export default function SiteReviewPageView({
  datePickerVisible,
  showDatePicker,
  hideDatePicker,
  control,
  setValue,
  isSubmitting,
  errors,
  watch,
  onSubmit,
  selectedDiveSite,
  unitSystem
}: ShopReviewCreatorProps) {
  const [images, setImages] = useState([]);

  const handleDatePickerConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setValue("DiveDate", formattedDate);
    hideDatePicker();
  };

  const { t } = useTranslation();
  const conditions = watch("Conditions");
  const currentIntensity = conditions.find(c => c.conditionId === DiveConditions.CURRENT_INTENSITY)?.value || 0;
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

  useEffect(() => {
    if (currentIntensity > 0) {
      setShowCurrentButtons(true);
      Animated.timing(heightAnim, {
        toValue: moderateScale(130),
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowCurrentButtons(false);
      });
    }
  }, [currentIntensity, heightAnim]);

  const handleBooleanConditions = (condition_id: number) => {
    const conditions = watch("Conditions");
    const existingCondition = conditions.find(c => c.conditionId === condition_id);

    if (existingCondition) {
      const updatedConditions = conditions.map(c =>
        c.conditionId === condition_id ? { ...c, value: c.value === 1 ? 0 : 1 } : c
      );
      setValue("Conditions", updatedConditions);
    } else {
      setValue("Conditions", [...conditions, { conditionId: condition_id, value: 1 }]);
    }
  };

  const handleSliderConditions = (condition_id: number, sliderValue: number) => {
    const conditions = watch("Conditions");
    const existingCondition = conditions.find(c => c.conditionId === condition_id);

    let updatedConditions = conditions;

    if (existingCondition) {
      updatedConditions = conditions.map(c =>
        c.conditionId === condition_id ? { ...c, value: sliderValue } : c
      );
    } else {
      updatedConditions = [...conditions, { conditionId: condition_id, value: sliderValue }];
    }

    if (condition_id === DiveConditions.CURRENT_INTENSITY && sliderValue === 0) {
      const dependentConditions = [
        DiveConditions.CURRENT_LATTERAL,
        DiveConditions.CURRENT_UP,
        DiveConditions.CURRENT_DOWN,
        DiveConditions.CURRENT_CONTRASTING
      ];

      updatedConditions = updatedConditions.filter(c => !dependentConditions.includes(c.conditionId));
    }

    setValue("Conditions", updatedConditions);
  };

  const imagesArray = [];
  images.forEach((image) => {
    imagesArray.push({ photofile: image });
  });

  return (
    <S.ContentContainer>
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

        <S.Buffer />

        <Label label={t("DiveSiteReviewer.typOfDive")} />
        {/* Type Of Dive Toggles goes here */}

        <S.TypeOfDiveButtons>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.shoreDiveButton")}
              iconLeft={"island"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.SHORE_DIVE)}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.boatDiveButton")}
              iconLeft={"sailboat"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.BOAT_DIVE)}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.nightDiveButton")}
              iconLeft={"moon-stars"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.NIHGT_DIVE)}
            />
          </S.ButtonRow>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.altitudeDiveButton")}
              iconLeft={"mountains"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.ALTITUDE_DIVE)}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.wreckDiveButton")}
              iconLeft={"directions-boat"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.WREAK_DIVE)}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.caveDiveButton")}
              iconLeft={"vinyl-record"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.CAVE_DIVE)}
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
              onPress={() => handleBooleanConditions(DiveConditions.SALT_WATER)}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.freshWaterButton")}
              iconLeft={"fresh-water"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.FRESH_WATER)}
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
              onPress={() => handleBooleanConditions(DiveConditions.SURFACE_TRAFFIC)}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.surgeButton")}
              iconLeft={"waves"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.SURGE)}
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
              onPress={() => handleBooleanConditions(DiveConditions.NO_REFS)}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.limitsButton")}
              iconLeft={"warning-diamond"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.MAX_DEPTH)}
            />
          </S.ButtonRow>
          <S.ButtonRow>
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.kelpButton")}
              iconLeft={"coral"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.KELP)}
            />
            <S.StyledButton
              size={"thin"}
              title={t("DiveSiteReviewer.pollutionButton")}
              iconLeft={"beer-bottle"}
              alt
              round={false}
              onPress={() => handleBooleanConditions(DiveConditions.POLLUTION)}
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
          onValueChange={(value) => handleSliderConditions(DiveConditions.VISIBILITY, value)}
        />

        {/* Current Slider goes here */}
        <ReusableSlider
          title={<S.Label>{t("DiveSiteReviewer.current")}</S.Label>}
          leftValue={metrics.lowValueCur}
          rightValue={metrics.highValueCur}
          unitMeasurement={metrics.rateMetric}
          onValueChange={(value) => handleSliderConditions(DiveConditions.CURRENT_INTENSITY, value)}
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
                  onPress={() => handleBooleanConditions(DiveConditions.CURRENT_LATTERAL)}
                />
                <S.StyledButton
                  size={"thin"}
                  title={t("DiveSiteReviewer.upCurrentButton")}
                  iconLeft={"circle-arrow-up"}
                  alt
                  round={false}
                  onPress={() => handleBooleanConditions(DiveConditions.CURRENT_UP)}
                />
              </S.ButtonRow>
              <S.ButtonRow>
                <S.StyledButton
                  size={"thin"}
                  title={t("DiveSiteReviewer.downCurrentButton")}
                  iconLeft={"circle-arrow-down"}
                  alt
                  round={false}
                  onPress={() => handleBooleanConditions(DiveConditions.CURRENT_DOWN)}
                />
                <S.StyledButton
                  size={"thin"}
                  title={t("DiveSiteReviewer.contrastCurrentButton")}
                  iconLeft={"arrow-left-right-reverse"}
                  alt
                  round={false}
                  onPress={() => handleBooleanConditions(DiveConditions.CURRENT_CONTRASTING)}
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
          <PreviewGrid items={imagesArray} onAddSighting={handleSelectImages} buttonText="Add Dive Photos" />
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
          onPress={onSubmit}
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