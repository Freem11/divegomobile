import React from "react";
import * as S from "./styles";
import { View, ScrollView } from "react-native";
import { colors } from "../../styles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTranslation } from "react-i18next";
import PriceTextInput from "../../reusables/priceTextInput";
import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
import Label from "../../reusables/label";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import EmptyState from "../../reusables/emptyState";
import IconWithLabel from "../../reusables/iconWithLabal";
import { Controller, useForm } from "react-hook-form";
import { Form, FormRules } from "./form";
import { useMapStore } from "../../googleMap/useMapStore";

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
  handleDatePickerConfirm: (formData: Required<Form>) => void
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

  const { control, handleSubmit, formState: { isSubmitting, errors }, getValues } = useForm<Form>({
    values: values
  });
  
  const { t } = useTranslation();
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  
  const handleMapFlip = async (formData: Required<Form>) => {
    closeParallax(1)
    setFormValues(formData)
  }

  return (
    <S.ContentContainer>
      {editMode ? (
        <S.Header>{t("TripCreator.headerEdit")}</S.Header>
      ) : (
        <S.Header>{t("TripCreator.header")}</S.Header>
      )}

      <S.InputGroupContainer>
      <S.InputBox>
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
                value={value}
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
                  <Toucher onPress={() => showDatePicker("Start")}>
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
                  <Toucher onPress={() => showDatePicker("End")}>
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
        </S.InputBox>
        
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
                placeholder={t("TripCreator.tripDescriptionPlaceholder").replace(/\\n/g, '\n')}
                onChangeText={onChange}
                value={value}
                >
              </S.MultilineTextInput>
            )}
          />
        </S.DescriptionBox>


        <Label label="Dive Sites" />

        <S.ScrollViewContainer>
          <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                          removeFromSitesArray(tripDetails.id, sitesArray)
                        }
                      />
                    </S.ItemHousing>
                    {index < tripDiveSites.length - 1 && <S.VerticalLine />}
                  </S.ListItemContainer>
                );
              })}
          </ScrollView>

          <S.ButtonHousing>
            <Button
              onPress={() => {
                const data = getValues();
                handleMapFlip(data as Required<Form>);
              }} 
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
        date={
          dateType === "startDate"
            ? values?.Start
              ? new Date(values.Start)
              : new Date()
            : values?.End
            ? new Date(values.End)
            : new Date()
        }
        onConfirm={() => {
          const data = getValues();
          handleDatePickerConfirm(data as Required<Form>);
        }} 
        onCancel={hideDatePicker}
        maximumDate={
          dateType === "startDate" && values.End
            ? new Date(values.End)
            : undefined
        }
        minimumDate={
          dateType === "endDate" && values.Start
            ? new Date(
                new Date(values.Start).setDate(
                  new Date(values.Start).getDate() + 1
                )
              )
            : undefined
        }
      />
    </S.ContentContainer>
  );
}
