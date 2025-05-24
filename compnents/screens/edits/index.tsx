import React, { useContext, useState } from "react";
import EditScreenView from './view';
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { updateProfile } from "../../../supabaseCalls/accountSupabaseCalls";
import { updateDiveSite } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { showError, showSuccess, showWarning, TOAST_MAP } from "../../toast";
import { Form } from "./form";
import { BasicFormData } from "./editsParallax";


type SiteSubmitterProps = {
  onClose: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
  setLocalPreviewUri: React.Dispatch<any>
  localPreviewUri: {uri : string} 
  initialFormData: BasicFormData
};

export default function EdittingScreen({
  onClose,
  closeParallax,
  restoreParallax,
  setLocalPreviewUri,
  localPreviewUri,
  initialFormData
}: SiteSubmitterProps) {

  const [isUploading, setIsUploading] = useState(false);
  const [newUri, setNewUri] = useState(null);
  const [supabaseResponse, setSupabaseResponse] = useState(null);


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

  const onSubmit = async (formData: Required<Form>) => {

    if (!formData.name) {
      showWarning("Please fill in all required fields.");
      return;
    }
    
    if(formData.uri !== localPreviewUri.uri){
        setIsUploading(true);

        try {
          const fileName = await tryUpload(localPreviewUri);
          if (!fileName) {
            throw new Error("Photo upload failed");
          }

          const fullPath = `animalphotos/public/${fileName}`;
          setNewUri(fullPath)

        } catch (err) {
          console.error("Error uploading image:", err);
          showError(err.message);
        } finally {
          setIsUploading(false);
        }
    }

    console.log(formData, localPreviewUri)

    if(initialFormData.dataType === "DiveSite"){
      const response = await updateDiveSite({
        id:                   formData.id,
        name:                 formData.name,
        diveSiteBio:          formData.bio,
        diveSiteProfilePhoto: newUri ? newUri : localPreviewUri.uri
      });
      setSupabaseResponse(response);
    } else if (initialFormData.dataType === "DiveCenter"){
      const response = await updateDiveShop({
        id:                   formData.id,
        orgName:              formData.name,
        diveShopBio:          formData.bio,
        diveShopProfilePhoto: newUri ? newUri : localPreviewUri.uri
      });
      setSupabaseResponse(response);
    }  else if (initialFormData.dataType === "Profile"){
      const response = await updateProfile({
        id:             formData.id,
        UserName:       formData.name,
        profileBio:     formData.bio,
        profilePhoto:   newUri ? newUri : localPreviewUri.uri
      });
      setSupabaseResponse(response);
    }

    if (supabaseResponse.error){
      showError("unable to save updates, please try again later")
    }
      showSuccess("Photo uploaded successfully!");
  }

  return (
    <EditScreenView
      onSubmit={onSubmit}
      closeParallax={closeParallax}
      restoreParallax={restoreParallax}
      initialFormData={initialFormData}
      values={{
        id: initialFormData?.id,
        name: initialFormData?.name,
        bio: initialFormData?.bio,
        uri: initialFormData?.uri
      }}
    />
  )

}