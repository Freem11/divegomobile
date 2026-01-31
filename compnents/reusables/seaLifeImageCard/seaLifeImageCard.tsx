import React, { useState, useContext } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { moderateScale } from "react-native-size-matters";
import email from "react-native-email";

import {
  insertPhotoLike,
  deletePhotoLike,
} from "../../../supabaseCalls/photoLikeSupabaseCalls";
import abbreviateNumber from "../../helpers/abbreviateNumber";
import ButtonIcon from "../../reusables/buttonIcon";
import IconCounterButton from "../iconCounterButton";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { cloudflareBucketUrl } from "../../globalVariables";
import { createPhotoLikeNotification, deletePhotoLikeNotification } from "../../../supabaseCalls/notificationsSupabaseCalls";
import { useAppNavigation } from "../../mapPage/types";

import * as S from "./styles";

interface Photo {
  UserID: string;
  UserName: string;
  commentcount: number;
  created_at: string;
  dateTaken: string;
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  likecount: number;
  likedbyuser: boolean;
  likeid: number | null;
  month: number;
  photoFile: string;
}

interface PictureProps {
  pic: Photo;
  dataSetType: string;
  diveSiteName?: string;
  setVisitProfileVals?: (val: any) => void;
  diveSiteAction?: () => void;
  profileViewAction?: () => void;
}

const windowWidth = Dimensions.get("window").width;

const SeaLifeImageCard = (props: PictureProps) => {
  const { pic, dataSetType } = props;
  const { userProfile } = useUserProfile();

  const [picLiked, setPicLiked] = useState(pic.likedbyuser);
  const [likeData, setLikeData] = useState(pic.likeid);
  const [countOfLikes, setCountOfLikes] = useState(pic.likecount);

  const [aspectRatio, setAspectRatio] = useState<number | null>(1);

  const fileName = pic.photoFile?.split("/").pop();
  const remoteUri = `${cloudflareBucketUrl}${fileName}`;

  const navigation = useAppNavigation();

  // useEffect(() => {
  //   if (remoteUri) {
  //     RNImage.getSize(
  //       remoteUri,
  //       (width, height) => {
  //         setAspectRatio(width / height);
  //       },
  //       (error) => {
  //         console.log("Failed to get image size:", error);
  //         setAspectRatio(1);
  //       }
  //     );
  //   }
  // }, [remoteUri]);

  const handleEmail = (pic: Photo) => {
    email(["scubaseasons@gmail.com"], {
      subject: `Reporting issue with picture: "${pic.label}" - ${pic.photoFile} `,
      body: "Type of issue: \n\n1) Animal name not correct\n2) Copyright claim",
      checkCanOpen: false,
    }).catch(console.error);
  };

  const handleLike = async (picId: number) => {
    if (picLiked) {
      await deletePhotoLike(likeData);
      setPicLiked(false);
      setCountOfLikes(countOfLikes - 1);
      await deletePhotoLikeNotification({
        senderId: userProfile.UserID,
        recipientId: pic.UserID,
        photoId: pic.id,
      });
    } else {
      const newRecord = await insertPhotoLike(userProfile.UserID, pic.id);
      setPicLiked(true);
      setLikeData(newRecord[0].id);
      setCountOfLikes(countOfLikes + 1);
      await createPhotoLikeNotification({
        senderId: userProfile.UserID,
        recipientId: pic.UserID,
        photoId: pic.id,
        photoPath: pic.photoFile,
      });
    }
  };

  const containerWidth = windowWidth - windowWidth * 0.07;
  const containerHeight = aspectRatio
    ? containerWidth / aspectRatio
    : moderateScale(200);

  return (
    <S.Container key={pic.id} style={{ width: containerWidth, height: containerHeight }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("PinchAndZoomPhoto", { photoFile: pic.photoFile })}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: moderateScale(10),
          backgroundColor: "#e0e0e0",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {aspectRatio ? (
          <Image
            source={{ uri: remoteUri }}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            contentFit="cover"
            // placeholder={require("../../../assets/icon.png")}
            transition={1000}
          />
        ) : (
          <S.PlaceholderText>Loading...</S.PlaceholderText>
        )}
      </TouchableOpacity>

      <S.Overlay pointerEvents="none" />

      <S.TopContentWrapper>
        <ButtonIcon
          style={{ width: moderateScale(20) }}
          onPress={() => handleEmail(pic)}
          icon="error-outline"
          size="micro"
        />
      </S.TopContentWrapper>

      <S.ContentWrapper>
        <S.LabelWrapper>
          <S.TitleText>{pic.label}</S.TitleText>
          {dataSetType === "ProfilePhotos" ? (
            <S.NavigateTextPressable onPress={props.diveSiteAction}>
              <S.NavigateText>View Site</S.NavigateText>
            </S.NavigateTextPressable>
          ) : (
            <S.NavigateTextPressable onPress={props.profileViewAction}>
              <S.NavigateText>{pic.UserName}</S.NavigateText>
            </S.NavigateTextPressable>
          )}
        </S.LabelWrapper>

        <S.IconsWrapper>
          <IconCounterButton
            icon="like-hand"
            onPress={() => handleLike(pic.id)}
            size="icon"
            fillColor={picLiked ? "red" : undefined}
            count={abbreviateNumber(countOfLikes)}
          />
          <IconCounterButton
            icon="comment"
            onPress={() => navigation.navigate("PhotoComments", { id: pic.id, userId: pic.UserID })}
            size="icon"
            count={abbreviateNumber(pic.commentcount)}
          />
        </S.IconsWrapper>
      </S.ContentWrapper>
    </S.Container>
  );
};

export default SeaLifeImageCard;
