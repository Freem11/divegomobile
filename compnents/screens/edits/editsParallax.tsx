import React, { useContext, useState } from "react";
import { ImagePickerAsset } from "expo-image-picker";
import { useForm } from "react-hook-form";

import ParallaxDrawer from "../../reusables/parallaxDrawer";
import noImage from "../../png/NoImage.png";
import { chooseImageHandler, imageUploadClean } from "../imageUploadHelpers";
import IconWithLabel from "../../reusables/iconWithLabal";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { EditsContext } from "../../contexts/editsContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { useAppNavigation } from "../../mapPage/types";
import { updateProfile } from "../../../supabaseCalls/accountSupabaseCalls";
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { cloudflareBucketUrl } from "../../globalVariables";
import { clearPhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { showError, showSuccess } from "../../toast";

import { Form } from "./form";

import EdittingScreen from ".";

export type BasicFormData = {
  dataType: string
  title: string
  id: number
  name: string
  bio: string
  uri: string
  placeholderName: string
  placeholderBio: string
};

export default function EditScreenParallax() {
  const { editInfo } = useContext(EditsContext);
  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const { selectedProfile, setSelectedProfile } = useContext(SelectedProfileContext);

  const preImage = `${cloudflareBucketUrl}${selectedProfile ? selectedProfile.profilePhoto.split("/").pop() : selectedShop.diveShopProfilePhoto.split("/").pop()}`;

  const [image, setImage] = useState<string>(preImage);

  const { control, setValue, handleSubmit } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange",
    values: {
      id: selectedShop.id || selectedProfile.id,
      name: selectedShop.orgName || selectedProfile.UserName,
      bio: selectedShop.diveShopBio || selectedProfile.profileBio || "",
      uri: selectedShop.diveShopProfilePhoto || selectedProfile.profilePhoto || ""
    }
  });

  const navigation = useAppNavigation();

  const onClose = async () => {
    navigation.goBack();
  };

  const popoverContent = () => {
    return (
      <>
        <IconWithLabel
          label="Change Header Image"
          iconName="camera-flip-outline"
          buttonAction={() => handleSelectImage()}
        />
      </>
    );
  };

  const handlePreviewImage = async (picture: ImagePickerAsset) => {
    const newPic = picture.uri;
    setImage(newPic);

    setValue("uri", newPic);
  };

  const handleSelectImage = async () => {
    try {
      const result = await chooseImageHandler();
      if (result?.assets?.[0]?.uri) {
        handlePreviewImage(result?.assets?.[0]);
      }
    } catch (e: any) {
      console.log("Image selection cancelled", e.message);
    }
  };

  const tryUpload = async (uri: string) => {
    try {
      return await imageUploadClean({ assets: [{ uri }] });
    } catch (e) {
      console.error("Error uploading image:", e);
      return null;
    }
  };

  const onSubmit = async (formData: Required<Form>) => {
    await clearPhoto(preImage);
    try {
      const fileName = await tryUpload(formData.uri);
      if (!fileName) {
        throw new Error("Photo upload failed");
      }

      const fullPath = `animalphotos/public/${fileName}`;

      if (editInfo === "Profile") {
        const response = await updateProfile({
          id: formData.id,
          UserName: formData.name,
          profileBio: formData.bio,
          profilePhoto: fullPath
        });
        setSelectedProfile(response);
      } else if (editInfo === "Dive Center") {
        const response = await updateDiveShop({
          id: formData.id,
          orgName: formData.name,
          diveShopBio: formData.bio,
          diveShopProfilePhoto: fullPath
        });
        setSelectedShop(response);
      }
      showSuccess(`You ${editInfo} info was sucessfully updated!`);
    } catch (err) {
      showError(`We ran into and errro updating you ${editInfo}, please try again later`);
      console.error("Error uploading image:", err);
    }
  };

  return (
    <ParallaxDrawer
      headerImage={image ? { uri: image } : noImage}
      onClose={onClose}
      popoverContent={popoverContent}
    >
      <EdittingScreen
        editInfo={editInfo}
        control={control}
        localPreviewUri={image}
        onSubmit={handleSubmit(onSubmit)}
      />
    </ParallaxDrawer>
  );
}
