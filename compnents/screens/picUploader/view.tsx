import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as S from "./styles";

import TextInputField from "../../authentication/utils/textInput";
import AnimalAutoSuggest from "../../autoSuggest/autoSuggest";
import { colors } from "../../styles";
import WavyHeaderUploader from "./wavyHeaderUploader";

export default function PicUploaderView({
  pinValues,
  showDatePicker,
  datePickerVisible,
  hideDatePicker,
  handleDatePickerConfirm,
  handleImageUpload,
  onSubmit,
  onClose,
  setPinValues,
  localPreviewUri,
  isUploading,
}) {
  const { t } = useTranslation();

  return (
    <S.Container>
      <S.BackButton>
        <MaterialIcons
          name="chevron-left"
          size={40}
          color={colors.themeWhite}
          onPress={onClose}
        />
      </S.BackButton>
      
      {pinValues.PicFile && (
        <S.AddPhotoButton>
          <MaterialIcons
            name="add-a-photo"
            size={30}
            color={colors.themeWhite}
            onPress={handleImageUpload}
          />
        </S.AddPhotoButton>
      )}

      <S.ContentContainer>
        <S.Header>{t("PicUploader.header")}</S.Header>

        <S.InputBlock>
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
        </S.InputBlock>

        <S.InputBlock>
          <S.Label>{t("PicUploader.whenLabel")}</S.Label>
          <S.TouchOverlay onPress={showDatePicker}>
            <S.TouchWrapper pointerEvents="none">
              <TextInputField
                icon={"calendar-month-outline"}
                inputValue={pinValues.PicDate}
                placeHolderText={t("PicUploader.whenPlaceholder")}
                secure={false}
                vectorIcon={"MaterialCommunityIcons"}
              />
            </S.TouchWrapper>
          </S.TouchOverlay>
        </S.InputBlock>

        <S.InputBlock>
          <S.Label>{t("PicUploader.whereLabel")}</S.Label>
          <TextInputField
            icon={"anchor"}
            inputValue={pinValues.siteName}
            placeHolderText={t("PicUploader.wherePlaceholder")}
            secure={false}
          />
        </S.InputBlock>

        <S.ButtonBox>
          <S.SubmitButton onPress={onSubmit}>
            <S.SubmitText>{t("PicUploader.submitButton")}</S.SubmitText>
            <MaterialIcons
              name="chevron-right"
              size={30}
              color={colors.themeWhite}
            />
          </S.SubmitButton>
        </S.ButtonBox>
      </S.ContentContainer>
      <WavyHeaderUploader
        image={pinValues.PicFile || localPreviewUri}
        onImageSelect={() => {}}
        isLoading={isUploading}
       />

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </S.Container>
  );
}
