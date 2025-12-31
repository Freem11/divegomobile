import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";

import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import noImage from "../../png/NoImage.png";
import { chooseImageHandler, imageUploadClean } from "../imageUploadHelpers";
import IconWithLabel from "../../reusables/iconWithLabal";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { EditsContext } from "../../contexts/editsContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { useAppNavigation } from "../../mapPage/types";
import { grabProfileById, updateProfile } from "../../../supabaseCalls/accountSupabaseCalls";
import { getDiveShopById, updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { cloudflareBucketUrl } from "../../globalVariables";
import { clearPhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { showError, showSuccess } from "../../toast";
import { EDIT_TYPE } from "../../../entities/editTypes";

import { Form } from "./form";

import EdittingScreen from ".";

interface EditsScreenProps {
  id: number;
  dataType: EDIT_TYPE;
}

export default function EditScreenParallax({ id, dataType }: EditsScreenProps) {
  const drawerRef = useRef<ParallaxDrawerHandle>(null);
  const { editInfo } = useContext(EditsContext);
  const [info, setInfo] = useState<any>(null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const { setSelectedShop } = useContext(SelectedShopContext);
  const { setSelectedProfile } = useContext(SelectedProfileContext);
  const navigation = useAppNavigation();

  const { control, setValue, handleSubmit, reset } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange",
    values: {
      id: id,
      name: info?.orgName || info?.UserName || "",
      bio: info?.diveShopBio || info?.profileBio || "",
      uri: info?.diveShopProfilePhoto || info?.profilePhoto || ""
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchedInfo;
        if (dataType === EDIT_TYPE.DIVE_CENTRE) {
          const res = await getDiveShopById(id);
          fetchedInfo = res[0];
        } else {
          fetchedInfo = await grabProfileById(id);
        }

        setInfo(fetchedInfo);

        const photoPath = fetchedInfo?.profilePhoto || fetchedInfo?.diveShopProfilePhoto;
        if (photoPath) {
          const fileName = photoPath.split("/").pop();
          setImage(`${cloudflareBucketUrl}${fileName}`);
        }
      } catch (error) {
        showError("Failed to load information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dataType]);

  useEffect(() => {
    return () => {
      setInfo(null);
      setImage(undefined);
      reset({
        id: undefined,
        name: "",
        bio: "",
        uri: ""
      });
    };
  }, [reset]);

  const onClose = () => {
    navigation.goBack();
  };

  const handleSelectImage = async () => {
    setTimeout(async () => {
      try {
        const result = await chooseImageHandler();
        if (result?.assets?.[0]?.uri) {
          const newPic = result.assets[0].uri;
          setImage(newPic);
          setValue("uri", newPic, { shouldDirty: true });
        }
      } catch (e: any) {
        console.log("Image selection cancelled", e.message);
      }
    }, 300);

  };

  const onSubmit = async (formData: Required<Form>) => {
    const originalPhoto = info?.profilePhoto || info?.diveShopProfilePhoto;
    const preImagePath = originalPhoto ? `${cloudflareBucketUrl}${originalPhoto.split("/").pop()}` : "";

    if (preImagePath) {
      await clearPhoto(preImagePath);
    }

    console.log("formData", formData);
    let fileName: string | null = null;

    try {
      if (formData.uri.length > 0) {
        fileName = await imageUploadClean({ assets: [{ uri: formData.uri }] });
        if (!fileName) throw new Error("Photo upload failed");
      }

      let fullPath = null;
      if (fileName) {
        fullPath = `animalphotos/public/${fileName}`;
      }

      if (dataType === EDIT_TYPE.USER_PROFILE) {
        const response = await updateProfile({
          id: formData.id,
          UserName: formData.name,
          profileBio: formData.bio,
          profilePhoto: fullPath
        });
        setSelectedProfile(response);
      } else {
        const response = await updateDiveShop({
          id: formData.id,
          orgName: formData.name,
          diveShopBio: formData.bio,
          diveShopProfilePhoto: fullPath
        });
        setSelectedShop(response);
      }
      showSuccess(`Your ${editInfo} info was successfully updated!`);
      onClose();
    } catch (err) {
      showError(`Error updating ${editInfo}`);
      console.error(err);
    }
  };

  if (loading || !info) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={image ? { uri: image } : noImage}
      onClose={onClose}
      popoverContent={(close) => (
        <IconWithLabel
          label="Change Header Image"
          iconName="camera-flip-outline"
          buttonAction={() => {
            close();
            setTimeout(() => {
              handleSelectImage();
            }, 100);
          }}
        />
      )}
    >
      <EdittingScreen
        editInfo={editInfo}
        control={control}
        reset={reset}
        onSubmit={handleSubmit(onSubmit)}
      />
    </ParallaxDrawer>
  );
}