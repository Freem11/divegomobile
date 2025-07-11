import { Platform, TouchableOpacity, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { moderateScale } from "react-native-size-matters";
import * as FileSystem from "expo-file-system";
import ImgToBase64 from "react-native-image-base64";
import email from "react-native-email";
import Share from "react-native-share";
import { useTranslation } from "react-i18next";

import {
  insertPhotoLike,
  deletePhotoLike
} from "../../../supabaseCalls/photoLikeSupabaseCalls";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { SelectedPictureContext } from "../../contexts/selectedPictureContext";
import ImageCasherDynamic from "../../helpers/imageCashingDynamic";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import abbreviateNumber from "../../helpers/abbreviateNumber";
import ButtonIcon from "../../reusables/buttonIcon";
import { SelectedPhotoContext } from "../../contexts/selectedPhotoContext";
import { windowWidth } from "../paginator/styles";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";

import * as S from "./styles";

const GoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

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

const SeaLifeImageCard = (props: PictureProps) => {
  const { pic } = props;
  const { setSelectedPhoto } = useContext(SelectedPhotoContext);
  const activeScreen2 = useActiveScreenStore((state) => state.activeScreen);

  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { profile } = useContext(UserProfileContext);
  const { setSelectedPicture } = useContext(SelectedPictureContext);
  const [picLiked, setPicLiked] = useState(pic.likedbyuser);
  const [likeData, setLikeData] = useState(pic.likeid);
  const [countOfLikes, setCountOfLikes] = useState(pic.likecount);
  const { t } = useTranslation();

  const handleCommentModal = (pic: Photo) => {
    setFullScreenModal(true);
    setActiveTutorialID("CommentsModal");
    setSelectedPicture(pic);
  };

  const handleEmail = (pic: Photo) => {
    email(["scubaseasons@gmail.com"], {
      subject: `Reporting issue with picture: "${pic.label}" - ${pic.photoFile} `,
      body: "Type of issue: \n\n1) Animal name not correct\n2) Copyright claim",
      checkCanOpen: false
    }).catch(console.error);
  };

  const handleLike = async(picId: number) => {
    if (picLiked) {
      deletePhotoLike(likeData);
      setPicLiked(false);
      setCountOfLikes(countOfLikes - 1);
    } else {
      const newRecord = await insertPhotoLike(profile[0].UserID, pic.id);
      setPicLiked(true);
      setLikeData(newRecord[0].id);
      setCountOfLikes(countOfLikes + 1);
    }
  };

  const convertBase64 = async(photo: string) => {
    try {
      const fileName = photo.split("/").pop();
      const cacheDir = FileSystem.cacheDirectory + fileName;
      const base64String = await ImgToBase64.getBase64String(cacheDir);
      return `data:image/jpg;base64,${base64String}`;
    } catch (err) {
      console.log("Base64 conversion error:", err);
      return null;
    }
  };

  const onShare = async(pic: Photo) => {
    const { photoFile, UserName, label, dateTaken, latitude, longitude } = pic;
    const local = await getPhotoLocation(latitude, longitude);
    const url = await convertBase64(photoFile);
    const message = `Checkout this cool pic of a ${label} on Scuba SEAsons! Taken by ${UserName} at ${selectedDiveSite.name}, in ${local} on ${dateTaken}.\n\nhttps://scuba-seasons.web.app`;

    if (url) {
      const base64Data = url.split("base64,")[1];
      const fileUri = FileSystem.documentDirectory + "shared-image.jpg";
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64
      });

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        Share.open({
          title: "Share Scuba SEAsons photo",
          message,
          url: Platform.OS === "android" ? `file://${fileUri}` : fileUri,
          type: "image/jpeg"
        }).catch(console.error);
      }
    }
  };

  const getPhotoLocation = async(Lat: number, Lng: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Lat},${Lng}&key=${GoogleMapsApiKey}`
      );
      const placeInfo = await res.json();
      const address = placeInfo.results[1].formatted_address.split(",");
      return `${address[address.length - 2]},${address[address.length - 1]}`;
    } catch (err) {
      console.log("error", err);
      return "";
    }
  };

  const togglePhotoBoxModal = (photo) => {
    setSelectedPhoto(photo);
    setFullScreenModal(true);
    setActiveTutorialID("PinchAndZoomPhoto");
  };

  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const fileName = pic.photoFile?.split("/").pop();;
    const remoteUri = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${fileName}`;
  
    if(remoteUri)
      Image.getSize(remoteUri, (width, height) => {
        setAspectRatio(width / height);
      }, (error) => {
        console.log("Failed to get image size:", error);
      });
  }, [pic.photoFile]);

  return (
    <S.Container key={pic.id} style={{width: windowWidth, aspectRatio: aspectRatio}}>
      <S.Overlay pointerEvents="box-none">
        <TouchableOpacity
          onPress={() => togglePhotoBoxModal(pic.photoFile)}
          style={{
            aspectRatio,
            borderRadius: moderateScale(15),
            overflow: "hidden",
          }}
        >
          <ImageCasherDynamic
            photoFile={pic.photoFile}
            id={pic.id}
            aspectRatio={aspectRatio}
            style={{
              aspectRatio,
              borderRadius: moderateScale(15),
              resizeMode: "cover",
            }}
          />
        </TouchableOpacity>
  
        <S.TopContentWrapper>
          <S.IconWrapper>
            <ButtonIcon icon="share" onPress={() => onShare(pic)} size="icon" />
          </S.IconWrapper>
          <S.IconWrapper>
            <ButtonIcon icon="error-outline" onPress={() => handleEmail(pic)} size="micro" />
          </S.IconWrapper>
        </S.TopContentWrapper>
  
        <S.ContentWrapper>
          <S.LabelWrapper>
            <S.TitleText>{pic.label}</S.TitleText>
            {activeScreen2.screenName === "ProfileScreen" ? (
              <S.NavigateTextPressable onPress={props.diveSiteAction}>
                <S.NavigateText >View Site</S.NavigateText>
              </S.NavigateTextPressable>
            ) : (
              <S.NavigateTextPressable onPress={props.profileViewAction}>
                <S.NavigateText >{pic.UserName}</S.NavigateText>
              </S.NavigateTextPressable>
            )}
          </S.LabelWrapper>
  
          <S.CounterWrapper>
            <S.IconWrapper>
              <ButtonIcon
                icon="like-hand"
                onPress={() => handleLike(pic.id)}
                size="icon"
                fillColor={picLiked ? "red" : null}
              />
            </S.IconWrapper>
            <S.CounterText>{abbreviateNumber(countOfLikes)}</S.CounterText>
          </S.CounterWrapper>
  
          <S.CounterWrapper>
            <S.IconWrapper>
              <ButtonIcon
                icon="comment"
                onPress={() => handleCommentModal(pic)}
                size="icon"
              />
            </S.IconWrapper>
            <S.CounterText>{abbreviateNumber(pic.commentcount)}</S.CounterText>
          </S.CounterWrapper>
        </S.ContentWrapper>
      </S.Overlay>
    </S.Container>
  );
  
};

export default SeaLifeImageCard;
