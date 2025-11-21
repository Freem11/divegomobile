import React from "react";
import { View, Dimensions } from "react-native";
import { Control, Controller, FieldErrors, UseFormWatch } from "react-hook-form";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import moment from "moment";

import MobileTextInput from "../../../../reusables/textInput";
import * as S from "../../styles";
import { Form, FormRules } from "../form";
import PriceTextInput from "../../../../reusables/priceTextInput";

interface Step1Props {
  control: Control<Form, any, Form>
  setValue: (name: keyof Form, value: any) => void
  dateType: string
  errors: FieldErrors<Form>
  watch: UseFormWatch<Form>
  datePickerVisible: boolean
  showDatePicker: (value: string) => void
  hideDatePicker: () => void
}

export const Step1: React.FC<Step1Props> = ({
  control,
  setValue,
  dateType,
  errors,
  watch,
  datePickerVisible,
  showDatePicker,
  hideDatePicker,
}) => {
  const { t } = useTranslation();
  const screenWidth = Dimensions.get("window").width;

  const handleDatePickerConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setValue(dateType as keyof Form, formattedDate);
    hideDatePicker();
  };

  return (
    <S.InputGroupContainer>
      <S.Title>{t("TripCreator.step1Title")}</S.Title>
      <S.Subtitle>{t("DiveSiteReviewer.step1Description")}</S.Subtitle>

      <S.Label>{t("TripCreator.tripName")}</S.Label>
      <Controller
        control={control}
        name="Name"
        rules={FormRules.Name}
        render={({ field: { onChange, value } }) => (
          <MobileTextInput
            error={errors.Name}
            iconLeft="store"
            placeholder={t("TripCreator.tripNamePlaceholder")}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <S.Label>{t("TripCreator.bookingLink")}</S.Label>
      <Controller
        control={control}
        name="Link"
        rules={FormRules.Link}
        render={({ field: { onChange, value } }) => (
          <MobileTextInput
            error={errors.Link}
            iconLeft="link"
            placeholder={t("TripCreator.bookingLinkPlaceholder")}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <S.Label>{t("TripCreator.price")}</S.Label>
      <Controller
        control={control}
        name="Price"
        rules={FormRules.Price}
        render={({ field: { onChange, value } }) => (
          <PriceTextInput
            error={errors.Price}
            iconLeft="currency-usd"
            placeholder={t("TripCreator.pricePlaceholder")}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <S.Label>{t("DiveSiteReviewer.startDate")}</S.Label>
      <Controller
        control={control}
        name="Start"
        rules={FormRules.Start}
        render={({ field: { onChange, value } }) => (
          <Toucher onPress={() => showDatePicker("Start")}>
            <View pointerEvents="none" style={{ width: screenWidth - moderateScale(32) }}>
              <MobileTextInput
                error={errors.Start}
                iconLeft="calendar-start"
                placeholder={t("TripCreator.startDatePlaceholder")}
                onChangeText={onChange}
                value={value}
              />
            </View>
          </Toucher>
        )}
      />

      <S.Label>{t("DiveSiteReviewer.endDate")}</S.Label>
      <Controller
        control={control}
        name="End"
        rules={FormRules.End}
        render={({ field: { onChange, value } }) => (
          <Toucher onPress={() => showDatePicker("End")}>
            <View pointerEvents="none" style={{ width: screenWidth - moderateScale(32) }}>
              <MobileTextInput
                error={errors.End}
                iconLeft="calendar-end"
                placeholder={t("TripCreator.endDatePlaceholder")}
                onChangeText={onChange}
                value={value}
              />
            </View>
          </Toucher>
        )}
      />

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode={"date"}
        date={new Date()}
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </S.InputGroupContainer>
  );
};
