import React, { useContext, useState } from "react";
import PicUploaderView from "./view";
import moment from "moment";
import { chooseImageHandler, imageUpload} from "../imageUploadHelpers";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { insertPhotoWaits } from "../../../supabaseCalls/photoWaitSupabaseCalls";
import { PinContext } from "../../contexts/staticPinContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { ConfirmationModalContext } from "../../contexts/confirmationModalContext";
import { ActiveConfirmationIDContext } from "../../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";

const curDate = new Date();
const FILE_PATH = "https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/";

export default function PicUploader() {
  const { pinValues, setPinValues } = useContext(PinContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const handleDatePickerConfirm = (selectedDate: Date) => {
    if (selectedDate > curDate) return;
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setPinValues({ ...pinValues, PicDate: formattedDate });
    setDatePickerVisible(false)
  };

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {
        const fileName = await imageUpload(image);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        if (pinValues.PicFile) {
          await removePhoto({
            filePath: FILE_PATH,
            fileName: pinValues.PicFile.split("/").pop(),
          });
        }

        setPinValues({
          ...pinValues,
          PicFile: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  const onSubmit = async () => {
    const { PicFile, PicDate, Animal } = pinValues;
    if (PicFile && PicDate && Animal) {
      await insertPhotoWaits(pinValues);
      setConfirmationType("Sea Creature Submission");
      setActiveConfirmationID("ConfirmationSuccess");
      resetForm();
    } else {
      setActiveConfirmationID("ConfirmationCaution");
    }
    setConfirmationModal(true);
  };

  const onClose = async () => {
    if (pinValues.PicFile) {
      await removePhoto({
        filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
        fileName: pinValues.PicFile.split("/").pop(),
      });
    }
    resetForm();
    setLevelTwoScreen(false);
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
      handleImageUpload={handleImageUpload}
      onSubmit={onSubmit}
      onClose={onClose}
      setPinValues={setPinValues}
    />
  );
}
