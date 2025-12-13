import React from "react";
import { Control, Controller, FieldErrors, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import MobileTextInput from "../../../../reusables/textInput";
import * as S from "../../styles";
import { Form, FormRules } from "../form";
import { FeatureButton } from "../../featureButton";
import { Explainer } from "../../explainer";
import { activeFonts } from "../../../../styles";

interface Step2Props {
  control: Control<Form, any, Form>
  setValue: (name: keyof Form, value: any) => void
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  getCurrentLocation: () => void;
  useMapFlip: () => void;
  values: Form
}

export const Step2: React.FC<Step2Props> = ({
  control,
  errors,
  getCurrentLocation,
  useMapFlip,
}) => {
  const { t } = useTranslation();

  const popoverContentBasic = () => {
    const Bold = styled(S.PopOverText)`
      font-family: ${activeFonts.Medium}
    `;

    return (
      <S.PopOver>
        <S.PopOverText>
          <Bold>Business Name</Bold>
          {"\n"}Is for display purposes, on your page and on the map.
          {"\n"}
          {"\n"}
          <Bold>Web page URL</Bold>
          {"\n"}We use this to evaluate and validate your business.
        </S.PopOverText>
      </S.PopOver >
    );
  };

  const popoverContentWhere = () => {
    const Bold = styled(S.PopOverText)`
      font-family: ${activeFonts.Medium}
    `;

    return (
      <S.PopOver>
        <S.PopOverText>
          <Bold>Coordinates</Bold>
          {"\n"}Used to place your business on our map.
        </S.PopOverText>
      </S.PopOver >
    );
  };

  const popoverContentLocation = () => {
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

      <S.Label>{t("PartnerRequestPage.step2Name")} <Explainer popoverContent={popoverContentBasic} /></S.Label>
      <Controller
        control={control}
        name="OrgName"
        rules={FormRules.OrgName}
        render={({ field: { onChange, value } }) => (
          <S.TextBuffer>
            <MobileTextInput
              error={errors.OrgName}
              iconLeft="diving-scuba-flag"
              placeholder={t("PartnerRequestPage.businessPlaceholder")}
              onChangeText={onChange}
              value={value}
            />
          </S.TextBuffer>
        )}
      />

      <Controller
        control={control}
        name="URL"
        rules={FormRules.URL}
        render={({ field: { onChange, value } }) => (
          <S.TextBuffer>
            <MobileTextInput
              error={errors.URL}
              iconLeft="link"
              placeholder={t("PartnerRequestPage.websitePlaceholder")}
              onChangeText={onChange}
              value={value}
            />
          </S.TextBuffer>
        )}
      />

      <S.Label>{t("PartnerRequestPage.step2Location")} <Explainer popoverContent={popoverContentWhere} /></S.Label>
      <Controller
        control={control}
        name="Latitude"
        rules={FormRules.Latitude}
        render={({ field: { onChange, value } }) => (
          <S.TextBuffer>
            <MobileTextInput
              error={errors.Latitude}
              iconLeft="latitude"
              placeholder={t("PartnerRequestPage.latPlaceholder")}
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
              placeholder={t("PartnerRequestPage.lngPlaceholder")}
              value={value ? String(value) : null}
              onChangeText={onChange}
              keyboardType="numbers-and-punctuation"
            />
          </S.TextBuffer>
        )}
      />

      <S.Label>{t("PartnerRequestPage.step2Helper")}  <Explainer popoverContent={popoverContentLocation} /></S.Label>

      <S.ButtonContainer>
        <FeatureButton iconName="target" title="I'm there" onPress={getCurrentLocation} />
        <FeatureButton iconName="location-on" title="Drop a pin" onPress={useMapFlip} />
      </S.ButtonContainer>

    </S.InputGroupContainer>
  );
};
