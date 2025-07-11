import React from "react";
import { View, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTranslation } from "react-i18next";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import { Controller, useForm } from "react-hook-form";

import { colors } from "../../styles";
import PriceTextInput from "../../reusables/priceTextInput";
import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
import Label from "../../reusables/label";
import EmptyState from "../../reusables/emptyState";
import IconWithLabel from "../../reusables/iconWithLabal";


import * as S from "./styles";
import { Form, FormRules } from "./form";

type TripCreatorProps = {
  values: Form;
  editMode: boolean
  onSubmit: (data: any) => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
  onDrawerHitBottom?: () => void;
  tripDiveSites: number[]
  sitesArray: number[]
  removeFromSitesArray: (siteIdNo: number, siteList: number[]) => void
  showDatePicker: (value: string) => void
  hideDatePicker: () => void
  handleDatePickerConfirm: () => void
  datePickerVisible: boolean
  dateType: string
};

export default function TripCreatorPageView({
  values,
  editMode,
  onSubmit,
  closeParallax,
  tripDiveSites,
  sitesArray,
  removeFromSitesArray,
  showDatePicker,
  hideDatePicker,
  handleDatePickerConfirm,
  datePickerVisible,
  dateType
}: TripCreatorProps) {

  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<Form>({
    values: values
  });
  
  const { t } = useTranslation();

  return (
    <S.ContentContainer>
      {editMode ? (
        <S.Header>{t("TripCreator.headerEdit")}</S.Header>
      ) : (
        <S.Header>{t("TripCreator.header")}</S.Header>
      )}

      <S.InputGroupContainer>
        <Label label="Details" />
        <Controller
          control={control}
          name="Name"
          rules={FormRules.Name}
          render={({ field: { onChange, value } }) => (
            <S.TextBuffer>
              <MobileTextInput 
                error={errors.Name}
                iconLeft="store"
                placeholder={t("TripCreator.tripNamePlaceholder")}
                onChangeText={onChange}
                value={value}
              />
            </S.TextBuffer>
          )}
        />

        <Controller
          control={control}
          name="Link"
          rules={FormRules.Link}
          render={({ field: { onChange, value } }) => (
            <S.TextBuffer>
              <MobileTextInput 
                error={errors.Link}
                iconLeft="link"
                placeholder={t("TripCreator.bookingLinkPlaceholder")}
                onChangeText={onChange}
                value={value}
              />
            </S.TextBuffer>
          )}
        />

        <Controller
          control={control}
          name="Price"
          rules={FormRules.Price}
          render={({ field: { onChange, value } }) => (
            <S.TextBuffer>
              <PriceTextInput 
                error={errors.Price}
                iconLeft="currency-usd"
                placeholder={t("TripCreator.pricePlaceholder")}
                onChangeText={onChange}
                value={value ? String(value): null}
              />
            </S.TextBuffer>
          )}
        />

        <Controller
          control={control}
          name="Start"
          rules={FormRules.Start}
          render={({ field: { onChange, value } }) => (
            <S.TextBuffer>
              <Toucher onPress={() => showDatePicker("startDate")}>
                <View pointerEvents="none">
                  <MobileTextInput 
                    error={errors.Start}
                    iconLeft="calendar-start"
                    placeholder={t("TripCreator.startDatePlaceholder")}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              </Toucher>
            </S.TextBuffer>
          )}
        />

        <Controller
          control={control}
          name="End"
          rules={FormRules.End}
          render={({ field: { onChange, value } }) => (
            <S.TextBuffer>
              <Toucher onPress={() => showDatePicker("endDate")}>
                <View pointerEvents="none">
                  <MobileTextInput 
                    error={errors.End}
                    iconLeft="calendar-end"
                    placeholder={t("TripCreator.endDatePlaceholder")}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              </Toucher>
            </S.TextBuffer>
          )}
        />

        <Label label="Itinerary" />

        <S.DescriptionBox>
          <Controller
            control={control}
            name="Details"
            rules={FormRules.Details}
            render={({ field: { onChange, value } }) => (
              <S.MultilineTextInput
                multiline
                error={errors.Details}
                placeholder={t("TripCreator.tripDescriptionPlaceholder").replace(/\\n/g, "\n")}
                onChangeText={onChange}
                value={value}
              >
              </S.MultilineTextInput>
            )}
          />
        </S.DescriptionBox>

        <Label label="Dive Sites" />

        <S.ScrollViewContainer>
          <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
            {tripDiveSites && tripDiveSites.length === 0 && (
              <EmptyState iconName="anchor" text="No Dive Sites Yet." />
            )}
            {Array.isArray(tripDiveSites) &&
              tripDiveSites.map((tripDetails, index) => {
                return (
                  <S.ListItemContainer key={tripDetails.id}>
                    <S.ItemHousing>
                      <IconWithLabel
                        label={tripDetails.name}
                        iconName="anchor"
                        fillColor="white"
                        bgColor={colors.primaryBlue}
                        buttonAction={() =>
                          removeFromSitesArray(tripDetails.id, sitesArray)}
                      />
                    </S.ItemHousing>
                    {index < tripDiveSites.length - 1 && <S.VerticalLine />}
                  </S.ListItemContainer>
                );
              })}
          </ScrollView>

          <S.ButtonHousing>
            <Button
              onPress={() => closeParallax(1)}
              size="medium"
              alt={true}
              title="Dive Sites"
              iconLeft="plus"
            />
          </S.ButtonHousing>
        </S.ScrollViewContainer>
       

        <S.BottomButtonBox>
          <Button
            onPress={() => handleSubmit(onSubmit)()} 
            size="medium"
            title={t("TripCreator.submitButton")}
            iconRight="chevron-right"
          />
        </S.BottomButtonBox>
      </S.InputGroupContainer>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
        maximumDate={dateType === "startDate" && values.End
          ? new Date(values.End)
          : undefined}
        minimumDate={dateType === "endDate" && values.Start
          ? new Date(
            new Date(values.Start).setDate(
              new Date(values.Start).getDate() + 1
            )
          )
          : undefined}
      />
    </S.ContentContainer>
  );
}
