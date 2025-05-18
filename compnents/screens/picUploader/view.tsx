import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as S from "./styles";

import TextInputField from "../../authentication/utils/textInput";
import AnimalAutoSuggest from "../../autoSuggest/autoSuggest";
import { colors } from "../../styles";
import WavyHeaderUploader from "./wavyHeaderUploader";
import MobileTextInput from "../../reusables/textInput";
import { Form, FormRules } from "./form";
import { useForm } from "react-hook-form";
import Button from "../../reusables/button";

interface IProps {
  values: Form;
  pinValues: any;
  isUploading: boolean;
  localPreviewUri: string | null;
  datePickerVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  setPinValues: (key: string, value: string) => void;
  showDatePicker: () => void;
  hideDatePicker: () => void;
  handleDatePickerConfirm: (date: Date) => void;
  onImageSelect: (uri: string) => void;
}

export default function PicUploaderView({
  values,
  pinValues,
  isUploading,
  localPreviewUri,
  datePickerVisible,
  onClose,
  onSubmit,
  setPinValues,
  onImageSelect,
  showDatePicker,
  hideDatePicker,
  handleDatePickerConfirm,
}: IProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Form>({
    values: values,
  });
  
  return (
    <S.ContentContainer>     
        <S.Header>{t("PicUploader.header")}</S.Header>

      <S.InputGroupContainer>

          <S.TextBuffer>
              <S.Label>{t("PicUploader.whatLabel")}</S.Label>
              <AnimalAutoSuggest
                pinValues={pinValues}
                setPinValues={setPinValues}
                inputValue={pinValues.Animal}
                icon={"shark"}
                placeHolderText={t("PicUploader.whatPlaceholder")}
                secure={false}
                vectorIcon={"MaterialCommunityIcons"}
              />
          </S.TextBuffer>
          <S.TextBuffer>
              <S.Label>{t("PicUploader.whenLabel")}</S.Label>
              <S.TouchOverlay onPress={showDatePicker}>
                <S.TouchWrapper pointerEvents="none">
                  <MobileTextInput 
                    iconLeft="calendar-month"
                    placeholder={t('PicUploader.whenPlaceholder')}
                    {...register('date', FormRules.date)}
                    />
                  {/* <TextInputField
                    icon={"calendar-month-outline"}
                    inputValue={pinValues.PicDate}
                    placeHolderText={t("PicUploader.whenPlaceholder")}
                    secure={false}
                    vectorIcon={"MaterialCommunityIcons"}
                  /> */}
                </S.TouchWrapper>
              </S.TouchOverlay>
          </S.TextBuffer>
          <S.TextBuffer>
              <S.Label>{t("PicUploader.whereLabel")}</S.Label>
              <MobileTextInput 
                    iconLeft="anchor"
                    placeholder={t('PicUploader.wherePlaceholder')}
                    {...register('diveSiteName')}
                    />
              {/* <TextInputField
                icon={"anchor"}
                inputValue={pinValues.siteName}
                placeHolderText={t("PicUploader.wherePlaceholder")}
                secure={false}
              /> */}
          </S.TextBuffer>
        </S.InputGroupContainer>


        <S.ButtonBox>
               <Button 
                 onPress={onSubmit} 
                 alt={false} 
                 size='medium'
                 title={t('PicUploader.submitButton')} 
                 iconRight="chevron-right"
                 />
            </S.ButtonBox>
            
      {/* <WavyHeaderUploader
        image={localPreviewUri}
        onImageSelect={onImageSelect}
        isLoading={isUploading}
       /> */}

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </S.ContentContainer>
  );
}
