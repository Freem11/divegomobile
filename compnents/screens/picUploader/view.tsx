import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTranslation } from "react-i18next";
import * as S from "./styles";
import MobileTextInput from "../../reusables/textInput";
import { Form, FormRules } from "./form";
import { Controller, useForm } from "react-hook-form";
import Button from "../../reusables/button";
import moment from "moment";
import DynamicSelect from '../../reusables/dynamicSelect';
import Icon from "../../../icons/Icon";
import { colors } from "../../styles";

type dropDownItem = {
  key: string, label: string
}

interface IProps {
  values: Form;
  isUploading: boolean;
  localPreviewUri: string | null;
  datePickerVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void
  getMoreAnimals: (search: string, limit: number, skip: number) => Promise<any>
  hideDatePicker: () => void;
  onImageSelect: (uri: string) => void;
}

export default function PicUploaderView({
  values,
  localPreviewUri,
  onSubmit,
  getMoreAnimals,
  hideDatePicker,
}: IProps) {
  const { t } = useTranslation();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Form>({
    values: values,
  });
  
  const handleDatePickerConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setValue('date', formattedDate);
    setDatePickerVisible(false);
  };

  const handleOnSubmit = (data: Form) => {
    // toast.dismiss();
    onSubmit(data);
  };

  return (
    <S.ContentContainer>     
        <S.Header>{t("PicUploader.header")}</S.Header>

      <S.InputGroupContainer>

          <S.TextBuffer>
              <S.Label>{t("PicUploader.whatLabel")}</S.Label>
              <Controller
              control={control}
              name="animal"
              rules={FormRules.animal}
              render={({ field: { onChange, onBlur, value } }) => (
                <DynamicSelect
                  allowCreate={true}
                  labelInValue={true}
                  modeSelectedTags="on"
                  placeholder={t("PicUploader.whatPlaceholder")}
                  getMoreOptions={getMoreAnimals}
                  iconLeft={<Icon name="shark" fill={colors.neutralGrey} />}
                  error={errors.animal}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </S.TextBuffer>

          
          <S.TextBuffer>
              <S.Label>{t("PicUploader.whenLabel")}</S.Label>
              <S.TouchOverlay onPress={() => setDatePickerVisible(true)}>
                <S.TouchWrapper pointerEvents="none">
                <Controller
                control={control}
                name="date"
                rules={FormRules.date}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MobileTextInput
                    iconLeft="calendar-month"
                    placeholder={t('PicUploader.whenPlaceholder')}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    editable={false}
                  />
                )}
              />
                </S.TouchWrapper>
              </S.TouchOverlay>
          </S.TextBuffer>
          <S.TextBuffer>
              <S.Label>{t("PicUploader.whereLabel")}</S.Label>
              <Controller
                control={control}
                name="diveSiteName"
                rules={FormRules.diveSiteName}
                render={({ field: { onBlur, value } }) => (
                  <MobileTextInput
                    iconLeft="anchor"
                    placeholder={t('PicUploader.wherePlaceholder')}
                    onBlur={onBlur}
                    value={value}
                    editable={false}
                  />
                )}
              />
          </S.TextBuffer>
        </S.InputGroupContainer>


        <S.ButtonBox>
               <Button 
                 onPress={handleSubmit(handleOnSubmit)} 
                 alt={false} 
                 size='medium'
                 title={t('PicUploader.submitButton')} 
                 iconRight="chevron-right"
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
