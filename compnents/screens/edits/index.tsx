import React, { useContext, useState } from "react";
import EditScreenView from './view';
import { updateProfile } from "../../../supabaseCalls/accountSupabaseCalls";
import { updateDiveSite } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { imageUpload } from "../imageUploadHelpers";
import { showError, showSuccess, showWarning } from "../../toast";
import { Form } from "./form";
import { BasicFormData } from "./editsParallax";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { UserProfileContext } from "../../contexts/userProfileContext";


type EdittingScreenProps = {
  localPreviewUri: string | null
  initialFormData: BasicFormData
};

export default function EdittingScreen({
  localPreviewUri,
  initialFormData
}: EdittingScreenProps) {

  const [isUploading, setIsUploading] = useState(false);
  const [newUri, setNewUri] = useState(null);
  const [supabaseResponse, setSupabaseResponse] = useState(null);

  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setSelectedShop } = useContext(SelectedShopContext);
  const { setSelectedProfile } = useContext(SelectedProfileContext);
  const { setProfile } = useContext(UserProfileContext);
  

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

    console.log('formData start', formData)
    console.log('localPreviewUri', localPreviewUri)
    if (!formData.name) {
      showWarning("Please fill in all required fields.");
      return;
    }

    let formDataUri: string
    if(formData.uri){
      formDataUri = formData.uri.split("/").pop() || "X"
    } else {
      formDataUri = "X"
    }

    let uploadedPhotoUri: string
    if(localPreviewUri){
      uploadedPhotoUri = localPreviewUri.split("/").pop() || "X"
    } else {
      uploadedPhotoUri = "X"
    }


    console.log(formDataUri, uploadedPhotoUri)
    
    let updatedUri = null;

    if(formDataUri !== uploadedPhotoUri){
        setIsUploading(true);

        try {
          const fileName = await tryUpload(localPreviewUri);
          if (!fileName) {
            throw new Error("Photo upload failed");
          }

          const fullPath = `animalphotos/public/${fileName}`;
          updatedUri = fullPath;
          setNewUri(fullPath)

        } catch (err) {
          console.error("Error uploading image:", err);
          showError(err.message);
        } finally {
          setIsUploading(false);
        }
    }

    console.log('formData', formData)

    if(initialFormData.dataType === "Dive Site"){
      const response = await updateDiveSite({
        id:                   formData.id,
        name:                 formData.name,
        diveSiteBio:          formData.bio,
        diveSiteProfilePhoto: updatedUri ? updatedUri : formData.uri
      });
      setSelectedDiveSite(response?.data[0])
      if(response){setSupabaseResponse(response);}
    } else if (initialFormData.dataType === "Dive Center"){
      const response = await updateDiveShop({
        id:                   formData.id,
        orgName:              formData.name,
        diveShopBio:          formData.bio,
        diveShopProfilePhoto: updatedUri ? updatedUri : formData.uri
      });
      setSelectedShop(response?.data)
      if(response){setSupabaseResponse(response);}
   
    }  else if (initialFormData.dataType === "Profile"){
      const response = await updateProfile({
        id:             formData.id,
        UserName:       formData.name,
        profileBio:     formData.bio,
        profilePhoto:   updatedUri ? updatedUri : formData.uri
      });
      console.log("data back", response)
      setSelectedProfile(response?.data[0])
      setProfile(response?.data[0])
      if(response){setSupabaseResponse(response);}
    }

    if (supabaseResponse && supabaseResponse.error){
      showError("unable to save updates, please try again later")
      return;
    } 
      showSuccess(`${initialFormData.dataType} updated sucessfuly!`);
  }

  return (
    <EditScreenView
      onSubmit={onSubmit}
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