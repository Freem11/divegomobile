import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FailedUploadFeedItem, FeedItem } from "../../../store/useFeedDataStore";
import * as S from "./styles";
import { useFileExists } from "../../../store/useFileExists";
import { useTranslation } from "react-i18next";

export type FeedItemComponentProps = {
  item: FeedItem;
  onRemove: (id: string) => void;
};

export default function FeedItemFailedUpload({
  item,
  onRemove,
}: FeedItemComponentProps & { item: FailedUploadFeedItem }) {
  const { isExist, resolvedUri } = useFileExists(item.imageUri);
  const { t } = useTranslation();

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
        <S.IconWrapper onPress={item.retryCallback}>
          <AntDesign name="sync" size={24} color="green" />
        </S.IconWrapper>
        <S.IconWrapper onPress={() => onRemove(item.id)}>
          <AntDesign name="delete" size={20} color="red" />
        </S.IconWrapper>
      </S.ActionsRow>
    </S.Card>
  );
}
