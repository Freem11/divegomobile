import React from "react";
import { Control, Controller, FieldErrors, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import MobileTextInput from "../../../../reusables/textInput";
import * as S from "../../styles";
import { Form, FormRules } from "../form";
import { FeatureButton } from "../../featureButton";
import { Explainer } from "../../explainer";
import { activeFonts, colors, fontSizes } from "../../../../styles";
import { useMapStore } from "../../../../googleMap/useMapStore";

const LoadingText = styled.Text`
  font-family: ${activeFonts.Medium};
  color: ${colors.lightGrey}; 
  font-size:${fontSizes.Header};
  text-align: center;
  margin-top: ${moderateScale(12)}px;
`;

interface Step1Props {
  control: Control<Form, any, Form>
  setValue: (name: keyof Form, value: any) => void
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  getCurrentLocation: () => void;
  useMapFlip: () => void;
  values: Form
}

export const Step1: React.FC<Step1Props> = ({
  control,
  errors,
  getCurrentLocation,
  useMapFlip,
}) => {
  const { t } = useTranslation();

  // Pull the loading state from your store
  const isLocating = useMapStore((state) => state.isLocating);

  const popoverContent = () => {
    const Bold = styled(S.PopOverText)`
      font-family: ${activeFonts.Medium}
    `;

    return (
      <S.PopOver>
        <S.PopOverText>
          <Bold>I'm there</Bold>
          {"\n"}Will use your current location, so use when you are at the dive site.
          {"\n"}
          {"\n"}
          <Bold>Drop a pin</Bold>
          {"\n"}Will take you to the map where you can place a pin to mark the site's location.
        </S.PopOverText>
      </S.PopOver >
    );
  };

  return (
    <S.InputGroupContainer>

      <S.Label>{t("DiveSiteAdd.step1Name")}</S.Label>
      <Controller
        control={control}
        name="Site"
        rules={FormRules.Site}
        render={({ field: { onChange, value } }) => (
          <S.TextBuffer>
            <MobileTextInput
              error={errors.Site}
              iconLeft="anchor"
              placeholder={t("DiveSiteAdd.siteNamePlaceholder")}
              onChangeText={onChange}
              value={value}
            />
          </S.TextBuffer>
        )}
      />

      <S.Label>{t("DiveSiteAdd.step1Location")}</S.Label>
      <Controller
        control={control}
        name="Latitude"
        rules={FormRules.Latitude}
        render={({ field: { onChange, value } }) => (
          <S.TextBuffer>
            <MobileTextInput
              error={errors.Latitude}
              iconLeft="latitude"
              placeholder={t("DiveSiteAdd.latPlaceholder")}
              value={value ? String(value) : null}
              onChangeText={onChange}
              keyboardType="numbers-and-punctuation"
            />
          </S.TextBuffer>
        )}
      />

      <Controller
        control={control}
        name="Longitude"
        rules={FormRules.Longitude}
        render={({ field: { onChange, value } }) => (
          <S.TextBuffer>
            <MobileTextInput
              error={errors.Longitude}
              iconLeft="longitude"
              placeholder={t("DiveSiteAdd.lngPlaceholder")}
              value={value ? String(value) : null}
              onChangeText={onChange}
              keyboardType="numbers-and-punctuation"
            />
          </S.TextBuffer>
        )}
      />

      {isLocating && (
        <LoadingText>
          {t("Common.acquiringCoordinates", "Acquiring precise coordinates...")}
        </LoadingText>
      )}

      <S.Label>
        {t("DiveSiteAdd.step1Helper")}
        <Explainer popoverContent={popoverContent} iconSize={20} />
      </S.Label>

      <S.ButtonContainer>
        <FeatureButton
          iconName="target"
          title="I'm there"
          onPress={getCurrentLocation}
          disabled={isLocating}
        />
        <FeatureButton
          iconName="location-on"
          title="Drop a pin"
          onPress={useMapFlip}
          disabled={isLocating}
        />
      </S.ButtonContainer>

    </S.InputGroupContainer>
  );
};