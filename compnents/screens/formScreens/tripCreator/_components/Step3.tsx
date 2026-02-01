import React, { } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import { Form } from "../form";
import * as S from "../../styles";
import EmptyState from "../../../../reusables/emptyState-new";
import { AddSitesButton } from "../../addDiveSiteButton";
import { DiveSiteWithUserName } from "../../../../../entities/diveSite";
import { DiveSitesCard } from "../../../../reusables/addDiveSiteButton";
import { CloneTripButton } from "../../cloneTripButton";

interface Step3Props {
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  watch: UseFormWatch<Form>
  errors: FieldErrors<Form>
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  tripDiveSites: DiveSiteWithUserName[]
  handleMapFlip: (formData: Required<Form>) => void;
  removeFromSitesArray: (siteIdNo: number, siteList: number[]) => void;
  sitesArray: number[]
  values: Required<Form>
}

export const Step3: React.FC<Step3Props> = ({
  editMode,
  setEditMode,
  tripDiveSites,
  handleMapFlip,
  removeFromSitesArray = () => { },
  sitesArray,
  values
}) => {
  const { t } = useTranslation();

  return (
    <S.InputGroupContainer>
      <S.Title>{t("TripCreator.step3Title")}</S.Title>
      <S.Subtitle style={{ marginBottom: moderateScale(12) }}>{t("TripCreator.step3Description")}</S.Subtitle>

      <AddSitesButton onAddSites={handleMapFlip} formValues={values} />

      <S.DiveSiteListWrapper>
        {tripDiveSites && tripDiveSites.map((diveSite) => (
          <DiveSitesCard
            key={diveSite.id}
            diveSiteId={diveSite.id}
            diveSiteName={diveSite.name}
            diveSitePhoto={diveSite.public_domain && `${diveSite.public_domain}/${diveSite.sm}`}
            sitesArray={sitesArray}
            onPress={() => removeFromSitesArray(diveSite.id, sitesArray)}

          />
        ))}
      </S.DiveSiteListWrapper>

      {!tripDiveSites && (
        <S.EmptyStateWrapper>
          <EmptyState
            iconName="anchor"
            title={t("TripCreator.emptyState")}
            subtitle=""
          />

        </S.EmptyStateWrapper>
      )}

      {editMode && (
        <S.CloneTripBox>
          <CloneTripButton setEditMode={setEditMode} />
        </S.CloneTripBox>
      )}

    </S.InputGroupContainer>
  );
};
