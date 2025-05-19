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
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { DynamicSelectOptionsAnimals } from "../../entities/DynamicSelectOptionsAnimals";

const FILE_PATH = "https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/";

type dropDownItem = {
  key: string, label: string
}

export interface Form {
  date?: string;
  photo?: string;
  animal?: dropDownItem;
  diveSiteName?: string;
}

export const INIT_FORM_STATE: Form = {
  date: "",
  photo: "",
  animal: {key: "", label: ""},
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

  const { profile } = useContext(UserProfileContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const onSubmit = async (formData: Required<Form>) => {
    console.log('formData', formData, localPreviewUri)

    if (!localPreviewUri || !formData.date || !formData.animal) {
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
        label: formData.animal.label,  // need to get reusable select migrated for this one
        dateTaken: formData.date,
        latitude: selectedDiveSite[0].latitude,
        longitude: selectedDiveSite[0].longitude,
        UserId: profile[0].UserID,
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
      datePickerVisible={datePickerVisible}
      hideDatePicker={() => setDatePickerVisible(false)}
      onImageSelect={handleImageUpload}
      onSubmit={onSubmit}
      onClose={onClose}
      getMoreAnimals={DynamicSelectOptionsAnimals.getMoreOptions}
      setPinValues={setPinValues}
      isUploading={isUploading}
      localPreviewUri={localPreviewUri}
      values={{
        diveSiteName: selectedDiveSite?.name,
      }}
    />
  );
}
