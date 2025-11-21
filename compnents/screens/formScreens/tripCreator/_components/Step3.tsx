import React, { } from "react";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native-gesture-handler";

import { Form } from "../form";
import * as S from "../../styles";
import { ReviewPhotos } from "../../../../../entities/diveSiteReview";
import EmptyState from "../../../../reusables/emptyState-new";
import Button from "../../../../reusables/button";
import { AddSitesButton } from "../../addDiveSiteButton";
import { DiveSitesCard } from "../../../../reusables/diveSiteCard";
import { DiveSiteWithUserName } from "../../../../../entities/diveSite";

interface Step3Props {
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  watch: UseFormWatch<Form>
  errors: FieldErrors<Form>
  tripDiveSites: DiveSiteWithUserName[]
}

export const Step3: React.FC<Step3Props> = ({
  control,
  setValue,
  watch,
  errors,
  tripDiveSites
}) => {
  const { t } = useTranslation();

  console.log("tripDiveSites", tripDiveSites);

  return (
    <S.InputGroupContainer>
      <S.Title>{t("TripCreator.step3Title")}</S.Title>
      <S.Subtitle style={{ marginBottom: moderateScale(12) }}>{t("TripCreator.step3Description")}</S.Subtitle>

      <AddSitesButton />

      <S.DiveSiteListWrapper>
        {tripDiveSites && tripDiveSites.map((diveSite) => (
          <DiveSitesCard
            key={diveSite.id}
            diveSiteId={diveSite.id}
            diveSiteName={diveSite.name}
            diveSitePhoto={diveSite.divesiteprofilephoto}
            onPress={null}
          />
        ))}
      </S.DiveSiteListWrapper>

      {!tripDiveSites && (
        <S.EmptyStateWrapper>
          <EmptyState
            iconName="diving-scuba-flag"
            title={t("TripCreator.emptyState")}
            subtitle=""
          />

        </S.EmptyStateWrapper>
      )}

    </S.InputGroupContainer>
  );
};
