import React, { Dispatch, useContext, useState } from "react";
import PicUploaderView from "./view";
import { imageUpload } from "../imageUploadHelpers";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { insertPhotoWaits } from "../../../supabaseCalls/photoWaitSupabaseCalls";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { showError, showSuccess, showWarning } from "../../toast";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { v4 as uuidv4 } from "uuid";
import { saveFailedUpload } from "../../feed/store/asyncStore";
import { useTranslation } from "react-i18next";
import { FailedUploadFeedItem, FEED_ITEM_TYPE, RETRY_TYPE } from "../../feed/store/types";
import { checkNetworkStatus } from "../../feed/store/utils";
import { DynamicSelectOptionsAnimals } from "../../../entities/DynamicSelectOptionsAnimals";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";

export const FILE_PATH = "https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/";

type dropDownItem = {
  key: string;
  label: string;
};

export interface Form {
  date?: string;
  photo?: string;
  animal?: dropDownItem;
  diveSiteName?: string;
}

export const INIT_FORM_STATE: Form = {
  date: "",
  photo: "",
  animal: { key: "", label: "" },
  diveSiteName: "",
};

type PicUploaderProps = {
  onClose: () => void;
  onMapFlip?: () => void;
  closeParallax?: (mapConfig: number) => void;
  restoreParallax?: () => void;
  handleImageUpload?: () => void;
  localPreviewUri: string;
  setLocalPreviewUri: Dispatch<any>;
};

export default function PicUploader({
  onClose,
  handleImageUpload,
  localPreviewUri,
  setLocalPreviewUri,
}: PicUploaderProps) {
  const { t } = useTranslation();
  const { profile } = useContext(UserProfileContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const selectedDiveSite = useActiveScreenStore((state) => state.activeScreen.params);
  
  const tryUpload = async (uri: string) => {
    try {
      return await imageUpload({ assets: [{ uri }] });
    } catch (e) {
      console.error("Error uploading image:", e);
      return null;
    }
  };

  const resetAndClose = () => {
    setLocalPreviewUri(null);
    onClose();
  }

  const buildFailedUploadItem = (formData: Required<Form>): FailedUploadFeedItem => {
    const ID = uuidv4()
    console.log("buildFailedUploadItem", formData)
    return {
      id: ID,
      type: FEED_ITEM_TYPE.FAILED_UPLOAD,
      title: t('PicUploader.uploadFailedTitle'),
      message: t('PicUploader.couldUploadMsg', { animal: formData.animal.label, diveSite: formData.diveSiteName }),
      timestamp: Date.now(),
      imageUri: localPreviewUri,
      retryMetaData: {
        payloadType: RETRY_TYPE.PIC_UPLOADER,
        payloads: [
          {
            localPreviewUri
          },
          {
            photoFile: null,
            label: formData.animal.label,
            dateTaken: formData.date,
            latitude: selectedDiveSite.lat,
            longitude: selectedDiveSite.lng,
            UserId: profile[0].UserID,
          }
        ]
      }
    };
  }

  const onSubmitOrCache = async (formData: Required<Form>) => {
    if (!localPreviewUri || !formData.date || !formData.animal) {
      showWarning(t('PicUploader.fillRequiredFields'));
      return;
    }
    const { isStableConnection } = await checkNetworkStatus()

    if (!isStableConnection) {
      const failedItemToUpload = buildFailedUploadItem(formData);
      await saveFailedUpload(failedItemToUpload)
      showError(t('PicUploader.offlineMsg'));
      resetAndClose();
    } else {
      await onSubmit(formData);
    }
  }

  const onSubmit = async (formData: Required<Form>) => {
    console.log(formData)
    setIsUploading(true);
    console.log(localPreviewUri)
    try {
      const fileName = await tryUpload(localPreviewUri);
      console.log('fileName', fileName)
      if (!fileName) {
        throw new Error(t('PicUploader.failedUpload'));
      }

      const fullPath = `animalphotos/public/${fileName}`;

      const { error } = await insertPhotoWaits({
        photoFile: fullPath,
        label: formData.animal.label,
        dateTaken: formData.date,
        latitude: selectedDiveSite.lat,
        longitude: selectedDiveSite.lng,
        UserId: profile[0].UserID,
      });

      if (error) {
        await removePhoto({
          filePath: FILE_PATH,
          fileName: fullPath,
        });

        throw new Error(t('PicUploader.failedToSave'));
      }
      setConfirmationType("Sea Creature Submission");
      showSuccess(t('PicUploader.successUpload'));
      resetAndClose()
    } catch (err) {
      console.error("Error uploading image:", err);
      showError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // const resetForm = () => {
  //   setPinValues({
  //     ...pinValues,
  //     PicFile: null,
  //     Animal: "",
  //     PicDate: "",
  //     Latitude: "",
  //     Longitude: "",
  //     DDVal: "0",
  //   });
  // };

  return (
    <PicUploaderView
      datePickerVisible={datePickerVisible}
      hideDatePicker={() => setDatePickerVisible(false)}
      onImageSelect={handleImageUpload}
      onSubmit={onSubmitOrCache}
      onClose={onClose}
      getMoreAnimals={DynamicSelectOptionsAnimals.getMoreOptions}
      isUploading={isUploading}
      localPreviewUri={localPreviewUri}
      values={{
        diveSiteName: selectedDiveSite?.name,
      }}
    />
  );
}
