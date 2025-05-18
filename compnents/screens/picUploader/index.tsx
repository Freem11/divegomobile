import React, { Dispatch, useContext, useState } from "react";
import PicUploaderView from "./view";
import moment from "moment";
import { imageUpload } from "../imageUploadHelpers";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { insertPhotoWaits } from "../../../supabaseCalls/photoWaitSupabaseCalls";
import { PinContext } from "../../contexts/staticPinContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { showError, showSuccess, showWarning, TOAST_MAP } from "../../toast";

const FILE_PATH = "https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/";

export interface Form {
  date?: string;
  photo?: string;
  animal?: string;
  diveSiteName?: string;
}

export const INIT_FORM_STATE: Form = {
  date: "",
  photo: "",
  animal: "",
  diveSiteName: "",
};

type PicUploaderProps = {
  onClose: () => void;
  onMapFlip?: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
  handleImageUpload?: () => void;
  localPreviewUri: string 
  setLocalPreviewUri: Dispatch<any>
};

export default function PicUploader({
  onClose,
  onMapFlip,
  closeParallax,
  restoreParallax,
  handleImageUpload,
  localPreviewUri,
  setLocalPreviewUri
}: PicUploaderProps) {

  const { pinValues, setPinValues } = useContext(PinContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  // const [localPreviewUri, setLocalPreviewUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDatePickerConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setPinValues({ ...pinValues, PicDate: formattedDate });
    setDatePickerVisible(false);
  };

  // const handleImageUpload = async (argPicture) => {
  //   setPinValues({
  //     ...pinValues,
  //     PicFile: `animalphotos/public/${argPicture}`,
  //   });
  //   setLocalPreviewUri(argPicture);
  // };

  const tryUpload = async () => {
    try {
      const image = {
        assets: [
          {
            uri: localPreviewUri,
          },
        ],
      };
      const fileName = await imageUpload(image);
      return fileName;
    } catch (e) {
      return null;
    }
  };

  const onSubmit = async () => {
    const { PicDate, Animal, Latitude, Longitude, UserId } = pinValues;

    if (!localPreviewUri || !PicDate || !Animal) {
      showWarning("Please fill in all required fields.");
      return;
    }

    setIsUploading(true);

    try {
      // Step 2: Upload image
      const fileName = await tryUpload();
      if (!fileName) {
        throw new Error("Photo upload failed");
      }

      const fullPath = `animalphotos/public/${fileName}`;

      const { error } = await insertPhotoWaits({
        photoFile: fullPath,
        label: Animal,
        dateTaken: PicDate,
        latitude: Latitude,
        longitude: Longitude,
        UserId,
      });
      if (error) {
        await removePhoto({
          filePath: FILE_PATH,
          fileName: fullPath,
        });

        throw new Error("Failed to save a photo");
      }
      // Step 5: Success
      setConfirmationType("Sea Creature Submission");
      showSuccess("Photo uploaded successfully!");
      resetForm();
      setLevelTwoScreen(false);
      setLocalPreviewUri(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      showError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setPinValues({
      ...pinValues,
      PicFile: null,
      Animal: "",
      PicDate: "",
      Latitude: "",
      Longitude: "",
      DDVal: "0",
    });
  };

  return (
    <PicUploaderView
      pinValues={pinValues}
      showDatePicker={() => setDatePickerVisible(true)}
      datePickerVisible={datePickerVisible}
      hideDatePicker={() => setDatePickerVisible(false)}
      handleDatePickerConfirm={handleDatePickerConfirm}
      onImageSelect={handleImageUpload}
      onSubmit={onSubmit}
      onClose={onClose}
      setPinValues={setPinValues}
      isUploading={isUploading}
      localPreviewUri={localPreviewUri}
    />
  );
}
