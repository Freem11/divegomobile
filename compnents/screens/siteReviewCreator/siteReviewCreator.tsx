import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { moderateScale } from "react-native-size-matters";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Animated } from "react-native";
import moment from "moment";

import { DiveConditions, DiveSiteConditions } from "../../../entities/diveSiteCondidtions";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { PhotoUpload } from "./_components/PhotoUpload";
import { multiImageHandler } from "../imageUploadHelpers";
import MobileTextInput from "../../reusables/textInput";
import EmptyState from "../../reusables/emptyState-new";
import ReusableSlider from "../../reusables/slider";
import Button from "../../reusables/button";
import { colors } from "../../styles";

import { ButtonGroup } from "./_components";
import { Form, FormRules } from "./form";
import * as S from "./styles";
import {SubmitButton, Title} from "./styles";

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
  const { t } = useTranslation();

  const [images, setImages] = useState([]);
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

  const conditions = watch("Conditions");
  const currentIntensity = conditions.find(c => c.conditionId === DiveConditions.CURRENT_INTENSITY)?.value || 0;

  const handleDatePickerConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setValue("DiveDate", formattedDate);
    hideDatePicker();
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
    const newPicArray = pictures.map((picture) => ( picture.uri ));
    setImages((prevImages) => [...prevImages, ...newPicArray]);

    const currentFormPhotos = watch("Photos");
    setValue("Photos", [...currentFormPhotos, ...newPicArray]);
  };

  const handleBooleanConditions = (updatedConditions: DiveSiteConditions[]) => {
    setValue("Conditions", updatedConditions);
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

  useEffect(() => {
    if (currentIntensity > 0) {
      setShowCurrentButtons(true);
      Animated.timing(heightAnim, {
        toValue: moderateScale(150),
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

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.Label>{t("DiveSiteReviewer.diveDate")}</S.Label>
        <Controller
          control={control}
          name="DiveDate"
          rules={FormRules.DiveDate}
          render={({ field: { onChange, value } }) => (
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
          )}
        />

        <S.Label>{t("DiveSiteReviewer.typOfDive")}</S.Label>
        <ButtonGroup
          multiple={true}
          initialSelected={[DiveConditions.SHORE_DIVE]}
          onSelectionChange={handleBooleanConditions}
          options={[
            {
              label: t("DiveSiteReviewer.shoreDiveButton"),
              icon: "island",
              value: DiveConditions.SHORE_DIVE
            },
            {
              label: t("DiveSiteReviewer.boatDiveButton"),
              icon: "sailboat",
              value: DiveConditions.BOAT_DIVE
            },
            {
              label: t("DiveSiteReviewer.nightDiveButton"),
              icon: "moon-stars",
              value: DiveConditions.NIHGT_DIVE
            },
            {
              label: t("DiveSiteReviewer.altitudeDiveButton"),
              icon: "mountains",
              value: DiveConditions.ALTITUDE_DIVE
            },
            {
              label: t("DiveSiteReviewer.wreckDiveButton"),
              icon: "directions-boat",
              value: DiveConditions.WREAK_DIVE
            },
            {
              label: t("DiveSiteReviewer.caveDiveButton"),
              icon: "vinyl-record",
              value: DiveConditions.CAVE_DIVE
            }
          ]}
        />

        <S.Label>{t("DiveSiteReviewer.typeOfWater")}</S.Label>
        <ButtonGroup
          multiple={false}
          initialSelected={[DiveConditions.SALT_WATER]}
          onSelectionChange={handleBooleanConditions}
          options={[
            {
              label: t("DiveSiteReviewer.saltWaterButton"),
              icon: "salt-water",
              value: DiveConditions.SALT_WATER
            },
            {
              label: t("DiveSiteReviewer.freshWaterButton"),
              icon: "fresh-water",
              value: DiveConditions.FRESH_WATER
            }
          ]}
          columns={2}
        />

        <S.Label>{t("DiveSiteReviewer.atTheSurface")}</S.Label>
        <ButtonGroup
          multiple={true}
          initialSelected={[DiveConditions.SURFACE_TRAFFIC]}
          onSelectionChange={handleBooleanConditions}
          columns={2}
          options={[
            {
              label: t("DiveSiteReviewer.trafficButton"),
              icon: "traffic-light",
              value: DiveConditions.SURFACE_TRAFFIC
            },
            {
              label: t("DiveSiteReviewer.surgeButton"),
              icon: "waves",
              value: DiveConditions.SURGE
            }
          ]}
        />

        <S.Label>{t("DiveSiteReviewer.inTheWater")}</S.Label>
        <ButtonGroup
          multiple={true}
          initialSelected={[DiveConditions.NO_REFS]}
          onSelectionChange={handleBooleanConditions}
          columns={2}
          options={[
            {
              label: t("DiveSiteReviewer.noRefsButton"),
              icon: "GPS-splash",
              value: DiveConditions.NO_REFS
            },
            {
              label: t("DiveSiteReviewer.limitsButton"),
              icon: "warning-diamond",
              value: DiveConditions.MAX_DEPTH
            },
            {
              label: t("DiveSiteReviewer.kelpButton"),
              icon: "coral",
              value: DiveConditions.KELP
            },
            {
              label: t("DiveSiteReviewer.pollutionButton"),
              icon: "beer-bottle",
              value: DiveConditions.POLLUTION
            }
          ]}
        />

        <S.Spacer />

        <ReusableSlider
          inverted
          title={t("DiveSiteReviewer.viz")}
          leftValue={metrics.lowValueViz}
          rightValue={metrics.highValueViz}
          unitMeasurement={metrics.simpleMetric}
          onValueChange={(value) => handleSliderConditions(DiveConditions.VISIBILITY, value)}
        />

        <S.Spacer />

        <ReusableSlider
          title={t("DiveSiteReviewer.current")}
          leftValue={metrics.lowValueCur}
          rightValue={metrics.highValueCur}
          unitMeasurement={metrics.rateMetric}
          onValueChange={(value) => handleSliderConditions(DiveConditions.CURRENT_INTENSITY, value)}
        />

        {showCurrentButtons && (
          <Animated.View style={{ height: heightAnim, overflow: "hidden" }}>
            <S.Label>{t("DiveSiteReviewer.currentDirection")}</S.Label>

            <ButtonGroup
              multiple={false}
              initialSelected={[DiveConditions.NO_REFS]}
              onSelectionChange={handleBooleanConditions}
              columns={2}
              options={[
                {
                  label: t("DiveSiteReviewer.latCurrentButton"),
                  icon: "arrow-left-right",
                  value: DiveConditions.CURRENT_LATTERAL
                },
                {
                  label: t("DiveSiteReviewer.upCurrentButton"),
                  icon: "circle-arrow-up",
                  value: DiveConditions.CURRENT_UP
                },
                {
                  label: t("DiveSiteReviewer.downCurrentButton"),
                  icon: "circle-arrow-down",
                  value: DiveConditions.CURRENT_DOWN
                },
                {
                  label: t("DiveSiteReviewer.contrastCurrentButton"),
                  icon: "arrow-left-right-reverse",
                  value: DiveConditions.CURRENT_CONTRASTING
                }
              ]}
            />
          </Animated.View>
        )}

        <S.Spacer />

        <S.Title>{t("DiveSiteReviewer.description")}</S.Title>

        {selectedDiveSite && (
          <S.Subtitle>
            {t("DiveSiteReviewer.reviewDescriptionPlaceholder", {
              siteName: selectedDiveSite.name
            }).replace(/\\n/g, "\n")}
          </S.Subtitle>
        )}

        <S.DescriptionBox>
          <Controller
            control={control}
            name="Description"
            rules={FormRules.Description}
            render={({ field: { onChange, value } }) => (
              <S.MultilineTextInput
                multiline
                error={errors.Description}
                placeholderTextColor={colors.neutralGrey}
                onChangeText={onChange}
                value={value}
              >
              </S.MultilineTextInput>
            )}
          />
        </S.DescriptionBox>

        <S.Title>{t("DiveSiteReviewer.addPhotos")}</S.Title>

      </S.InputGroupContainer>

      {images && images.length > 0 ? (
        <PhotoUpload items={imagesArray} onAddSighting={handleSelectImages} />
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
        <S.SubmitButton
          onPress={onSubmit}
          alt={false}
          size="thin"
          title={t("PicUploader.submitButton")}
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