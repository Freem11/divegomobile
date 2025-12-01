import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";

import Button from "../../reusables/button";
import ButtonIcon from "../../reusables/buttonIcon";

import * as S from "./styles";

type SettingsPageViewProps = {
  profileType: string;
  openPartnerAccountScreen: () => void;
  onClose: () => void
  handleLogout: () => void;
  alertHandler: () => void;
};

export default function SettingsPageView({
  profileType,
  openPartnerAccountScreen,
  onClose,
  handleLogout,
  alertHandler
}: SettingsPageViewProps) {

  const { t } = useTranslation();

  return (
    <S.ContentContainer>
      <S.SafeArea>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={onClose}
            size="small"
            fillColor={"darkgrey"}
          />
        </S.BackButtonWrapper>

      </S.SafeArea>

      <S.InputGroupContainer>
        <S.Header>{t("SettingsPage.header")}</S.Header>

        <S.SubHeader>
          {t("SettingsPage.subHeading")}
        </S.SubHeader>

        <S.DataHousing>
          {profileType === "Diver Account" ? (
            <>
              <S.DataLabels>{profileType}</S.DataLabels>
              <TouchableWithoutFeedback
                onPress={() => openPartnerAccountScreen()}
              >
                <S.PromptLinkText>
                  {t("SettingsPage.notPartnerAccount")}
                </S.PromptLinkText>
              </TouchableWithoutFeedback>
            </>
          ) : <S.DataLabelsAlt>{profileType}</S.DataLabelsAlt>}
        </S.DataHousing>

        <S.ButtonBox>
          <Button
            onPress={() => handleLogout()}
            alt={false}
            size="medium"
            title={t("SettingsPage.logout")}
            iconRight="chevron-right"
          />
        </S.ButtonBox>
      </S.InputGroupContainer>

      <S.InputGroupContainerDanger>
        <S.SubHeaderDanger>
          {t("SettingsPage.dangerZoneBar")}
        </S.SubHeaderDanger>

        <TouchableWithoutFeedback onPress={alertHandler}>
          <S.DataHousingDanger>
            <S.DataLabelsDanger>
              {t("SettingsPage.delAccount")}
            </S.DataLabelsDanger>
          </S.DataHousingDanger>
        </TouchableWithoutFeedback>
      </S.InputGroupContainerDanger>

    </S.ContentContainer>
  );
}