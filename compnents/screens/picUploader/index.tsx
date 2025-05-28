import React, { Dispatch, useContext, useState } from "react";
import PicUploaderView from "./view";
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
import NetInfo from "@react-native-community/netinfo";
import { FailedUploadFeedItem, FEED_ITEM_TYPE } from "../../feed/store/useFeedDataStore";
import { v4 as uuidv4 } from "uuid";
import { saveFailedUpload } from "../../feed/store/asyncStore";

const FILE_PATH = "https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/";

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
  onMapFlip,
  closeParallax,
  restoreParallax,
  handleImageUpload,
  localPreviewUri,
  setLocalPreviewUri,
}: PicUploaderProps) {
  const { profile } = useContext(UserProfileContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const tryUpload = async (localPreviewUri: string) => {
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

  const onSubmitOrCache = async (formData: Required<Form>) => {
    if (!localPreviewUri || !formData.date || !formData.animal) {
      showWarning("Please fill in all required fields.");
      return;
    }

    const netState = await NetInfo.fetch();

    if (true || !netState.isConnected || !netState.isInternetReachable) {

      // add to que
      const failedItemToUpload: FailedUploadFeedItem = {
        id: uuidv4(),
        type: FEED_ITEM_TYPE.FAILED_UPLOAD,
        title: "Upload Failed",
        message: "Could not upload image due to network issue",
        timestamp: Date.now(),
        imageUri: localPreviewUri,
        retryCallback: async () => {
          await onSubmit(formData);
        }

      };
      await saveFailedUpload(failedItemToUpload)
      showError("You are offline / slow network. Retry from the feed menu when you have a solid network.");
      // show error and cache the data

      return;
    }
    await onSubmit(formData);

  }
  
  const onSubmit = async (formData: Required<Form>) => {


    // localPreviewUri file:///data/user/0/com.freem11.divegomobile/cache/ImagePicker/67414f78-c609-445b-aa81-bba91b340fa7.jpeg
    setIsUploading(true);

  
    try {
      // Step 2: Upload image
      const fileName = await tryUpload(localPreviewUri);
      if (!fileName) {
        throw new Error("Photo upload failed");
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

      console.log("lol", {
        photoFile: fullPath,
        label: formData.animal.label,
        dateTaken: formData.date,
        latitude: selectedDiveSite.lat,
        longitude: selectedDiveSite.lng,
        UserId: profile[0].UserID,
      });

      // lol {"UserId": "acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd", "dateTaken": "2025-05-20", "label": "test", "latitude": "19.330867", "longitude": "-110.81545", "photoFile": "animalphotos/public/1747864883778.jpeg"}
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
      // setLevelTwoScreen(false);
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
      onSubmit={onSubmitOrCache}
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
