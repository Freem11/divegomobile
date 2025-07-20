import React, { useState } from "react";
import * as S from "./styles";
import { useFileExists } from "../../../store/useFileExists";
import { useTranslation } from "react-i18next";
import { showError, showSuccess, showWarning } from "../../../../toast";
import { imageUpload } from "../../../../screens/imageUploadHelpers";
import { insertPhotoWaits } from "../../../../../supabaseCalls/photoWaitSupabaseCalls";
import { removePhoto } from "../../../../cloudflareBucketCalls/cloudflareAWSCalls";
import { FILE_PATH } from "../../../../screens/picUploader";
import { FailedUploadFeedItem, FeedItem, RETRY_TYPE } from "../../../store/types";
import { checkNetworkStatus } from "../../../store/utils";
import ButtonIcon from "../../../../reusables/buttonIcon";
import { colors } from "../../../../styles";

export type FeedItemComponentProps = {
  item: FeedItem;
  onRemove: (id: string) => void;
};

export default function FeedItemFailedUpload({
  item,
  onRemove,
}: FeedItemComponentProps & { item: FailedUploadFeedItem }) {
  const [isLoading, setIsUploading] = useState(false);
  const { isExist, resolvedUri } = useFileExists(item.imageUri);
  const { t } = useTranslation();

  const tryUpload = async (uri: string) => {
    try {
      return await imageUpload({ assets: [{ uri }] });
    } catch (e) {
      console.error("Error uploading image:", e);
      return null;
    }
  };

  const uploadPicture = async () => {
    if (!isExist) {
      showError(t("PicUploader.retryFailedUpload"));
      setIsUploading(false);
      return;
    }

    const fileName = await tryUpload(
      item.retryMetaData.payloads[0]?.localPreviewUri || ""
    );
    if (!fileName) {
      showError(t("PicUploader.retryFailedUpload"));
      setIsUploading(false);
      return;
    }
    const payload = item.retryMetaData.payloads[1];
    const fullPath = `animalphotos/public/${fileName}`;

    const { error } = await insertPhotoWaits({
      photoFile: fullPath,
      label: payload.label,
      dateTaken: payload.dateTaken,
      latitude: payload.latitude,
      longitude: payload.longitude,
      UserId: payload.UserId,
    });

    if (error) {
      await removePhoto({
        filePath: FILE_PATH,
        fileName: fullPath,
      });

      showError(t("PicUploader.retryFailedUpload"));
      setIsUploading(false);
      return;
    }
    showSuccess(t("PicUploader.successUpload"));
    setIsUploading(false);
    onRemove(item.id);
  };

  const handleOnRetry = async () => {
    setIsUploading(true);
    const { isStableConnection } = await checkNetworkStatus();
    if (!isStableConnection) {
      showError(t("PicUploader.offlineMsg"));
      setIsUploading(false);
      return;
    }
    try {
      switch (item.retryMetaData.payloadType) {
      case RETRY_TYPE.PIC_UPLOADER:
          await uploadPicture();
          break;  
        default:
          showWarning(t("Toast.errorMessage"));
          console.warn(
            "Unknown payload type for retry:",
            item.retryMetaData.payloadType
          );
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <S.Card>
      <S.Message>{item.title}</S.Message>
      {isExist && resolvedUri ? (
        <S.ImagePreview source={{ uri: resolvedUri }} resizeMode="cover" />
      ) : (
        <S.ImageFallback>
          <S.FallbackText>{t("PicUploader.noPreviewAvailable")}</S.FallbackText>
        </S.ImageFallback>
      )}
      <S.Timestamp>{item.message}</S.Timestamp>
      <S.ActionsRow>
        {isLoading ? (
          <ButtonIcon
            icon="replay"
            onPress={() => showWarning(t("Toast.pleaseWait"))}
            size="headerIcon"
            fillColor={colors.themeBlack}
          />
        ) : (
          <ButtonIcon
            icon="replay"
            onPress={handleOnRetry}
            size="headerIcon"
            fillColor={colors.themeGreen}
          />
        )}
        <ButtonIcon
          icon="trash"
          onPress={() => onRemove(item.id)}
          size="headerIcon"
          fillColor={colors.themeRed}
        />
      </S.ActionsRow>
    </S.Card>
  );
}
