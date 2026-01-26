import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import moment from "moment";

import * as S from "../../styles";

export const Step1 = ({
  errors,
  watch,
  setValue,
  datePickerVisible,
  hideDatePicker,
  showDatePicker,
}: any) => {
  const { t } = useTranslation();

  const photosError = errors?.Photos;
  const sightingDate = watch("SightingDate");

  const handleDatePickerConfirm = (date: Date) => {
    setValue("SightingDate", date);
    hideDatePicker();
  };

  return (
    <S.InputGroupContainer>
      <S.Title>{t("picUploader.step1.title")}</S.Title>

      <S.InputContainer onPress={showDatePicker}>
        <S.Label>{t("picUploader.step1.sightingDate")}</S.Label>
        <S.ValueText>
          {moment(sightingDate).format("MMMM Do, YYYY")}
        </S.ValueText>
      </S.InputContainer>

      {photosError?.message && (
        <S.ErrorText>{photosError.message}</S.ErrorText>
      )}

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode={"date"}
        date={sightingDate instanceof Date ? sightingDate : new Date()}
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </S.InputGroupContainer>
  );
};