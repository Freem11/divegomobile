import React, { useContext } from "react";
import EditScreenView from './view';
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { updateProfile } from "../../../supabaseCalls/accountSupabaseCalls";
import { updateDiveSite } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { showError, showSuccess, showWarning, TOAST_MAP } from "../../toast";
import { Form } from "./form";
import { BasicFormData } from "./editsParallax";

type SiteSubmitterProps = {
  onClose: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
  localPreviewUri: string 
  initialFormData: BasicFormData
};

export default function EdittingScreen({
  onClose,
  closeParallax,
  restoreParallax,
  localPreviewUri,
  initialFormData
}: SiteSubmitterProps) {

  const onSubmit = async (formData: Required<Form>) => {

    console.log(formData)

    // if (!formData.name) {
    //   showWarning("Please fill in all required fields.");
    //   return;
    // }

    // const response = await updateDiveSite({
    //   id:           initialFormData.id,
    //   name:         formData.name,
    //   diveSitebio:  formData.bio,
    //   photo:        localPreviewUri
    // });

    // if (response.error)
    //   showError("unable to save updates, please try again later")


  }

  return (
    <EditScreenView
      onSubmit={onSubmit}
      closeParallax={closeParallax}
      restoreParallax={restoreParallax}
      values={{
        name: initialFormData?.name,
        bio: initialFormData?.bio
      }}
    />
  )

}