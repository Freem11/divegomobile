import { Platform } from "react-native";
import React, { useState, useContext } from "react";
import { moderateScale } from "react-native-size-matters";
import {
  insertPhotoLike,
  deletePhotoLike
} from "../../supabaseCalls/photoLikeSupabaseCalls";
import { grabProfileByUserName } from "../../supabaseCalls/accountSupabaseCalls";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedPictureContext } from "../contexts/selectedPictureContext";
import { SelectedProfileContext } from "../contexts/selectedProfileModalContext";
import ImageCasherDynamic from "../helpers/imageCashingDynamic";
import * as FileSystem from "expo-file-system";
import ImgToBase64 from "react-native-image-base64";
import email from "react-native-email";
import Share from "react-native-share";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { useTranslation } from "react-i18next";
import abbreviateNumber from "../helpers/abbreviateNumber";
import ButtonIcon from "../reusables/buttonIcon";
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
  setVisitProfileVals: (val: any) => void;
}

const Picture = (props: PictureProps) => {
  const { pic, dataSetType, setVisitProfileVals } = props;
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { profile } = useContext(UserProfileContext);
  const { setSelectedPicture } = useContext(SelectedPictureContext);
  const { setSelectedProfile } = useContext(SelectedProfileContext);
  const [picLiked, setPicLiked] = useState(pic.likedbyuser);
  const [likeData, setLikeData] = useState(pic.likeid);
  const [countOfLikes, setCountOfLikes] = useState(pic.likecount);
  const { t } = useTranslation();

  const handleCommentModal = (pic: Photo) => {
    // setCommentsModal(true);
    setFullScreenModal(true);
    setActiveTutorialID("CommentsModal");
    setSelectedPicture(pic);
  };

  const handleEmail = (pic: Photo) => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with picture: "${pic.label}" - ${pic.photoFile} `,
      body: "Type of issue: \n \n 1) Animal name not correct \n (Please provide the correct animal name and we will correct the record)\n \n 2)Copy write image claim \n (Please provide proof that you own the submitted photo and we will remove it as you have requested)",
      checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const handleLike = async (picId: number) => {
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

  const handleFollow = async (userName: string) => {
    const picOwnerAccount = await grabProfileByUserName(userName);

    if (profile[0].UserID === picOwnerAccount[0].UserID) {
      return;
    }

    setSelectedProfile(picOwnerAccount);
    setLevelOneScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("ProfileScreen");
    useButtonPressHelper(
      "ProfileScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  };

  const handleDiveSiteMove = async (pic: Photo) => {
    setSelectedDiveSite({
      SiteName: selectedDiveSite.name,
      Latitude: pic.latitude,
      Longitude: pic.longitude
    });
    setVisitProfileVals(null);
    setSelectedProfile(null);
    setLevelTwoScreen(false);
  };

  const convertBase64 = async (photo: string) => {
    const temp = photo.split("/");
    const lastIndex = temp.length - 1;
    const fileName = temp[lastIndex];
    const cacheDir = FileSystem.cacheDirectory + fileName;
    try {
      const base64String = await ImgToBase64.getBase64String(cacheDir);
      const result = `data:image/jpg;base64,${base64String}`;

      return result;
    } catch (err) {
      console.log("Base64 conversion error:", err);
      return null;
    }
  };

  const onShare = async (pic: Photo) => {
    const { photoFile, UserName, label, dateTaken, latitude, longitude } = pic;
    const localUri = "https://scuba-seasons.web.app";
    const local = await getPhotoLocation(latitude, longitude);
    const url = await convertBase64(photoFile);
    const message = `Checkout this cool pic of a ${label} on Scuba SEAsons! It was taken by ${UserName} at the dive site: ${selectedDiveSite.name}, in${local} on ${dateTaken}.\nMaybe we should start contributing our pics as well!\n\nLearn more about it here:\n${localUri}`;

    try {
      if (url) {
        // Extract base64 data
        const base64Data = url.split(",")[1] || url.split("base64,")[1];

        // Save to a temporary file
        const fileUri = FileSystem.documentDirectory + "shared-image.jpg";
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64
        });

        // Verify file exists
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        // console.log(
        //   "File exists:",
        //   fileInfo.exists,
        //   "File size:",
        //   fileInfo.size
        // );

        if (fileInfo.exists) {
          // Use react-native-share which works well on both platforms
          const options = {
            title: "Share Scuba SEAsons photo",
            message: message,
            url: Platform.OS === "android" ? `file://${fileUri}` : fileUri,
            type: "image/jpeg"
          };

          const result = await Share.open(options);
          console.log("Share result:", result);
        }
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const getPhotoLocation = async (Lat: number, Lng: number) => {
    // const Lat = Number(photoLat);
    // const Lng = Number(photoLng);

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Lat},${Lng}&key=${GoogleMapsApiKey}`
      );
      const placeInfo = await res.json();
      const genAddress = placeInfo.results[1].formatted_address;
      const fudgedAddress = genAddress.split(",");
      const bits = [
        fudgedAddress[fudgedAddress.length - 2],
        fudgedAddress[fudgedAddress.length - 1]
      ].join();
      return bits;
    } catch (err) {
      console.log("error", err);
    }
  };

  // const togglePhotoBoxModal = (photo) => {
  //   setSelectedPhoto(photo);
  //   setFullScreenModal(true);
  //   setActiveTutorialID("PinchAndZoomPhoto");
  // };

  return (
    <S.Container key={pic.id}>
      <S.Overlay>
        <S.TopContentWrapper>
          <S.IconWrapper>
            <ButtonIcon icon="share" onPress={() => onShare(pic)} size="icon" />
          </S.IconWrapper>

          <S.IconWrapper>
            <ButtonIcon
              icon="error-outline"
              onPress={() => handleEmail(pic)}
              size="micro"
            />
          </S.IconWrapper>
        </S.TopContentWrapper>

        <S.ContentWrapper>
          <S.LabelWrapper>
            <S.TitleText>{pic.label}</S.TitleText>

            {dataSetType === "ProfilePhotos" ? (
              <S.NavigateTextPressable>
                <S.NavigateText onPress={() => handleDiveSiteMove(pic)}>
                  View Site
                </S.NavigateText>
              </S.NavigateTextPressable>
            ) : (
              <S.NavigateTextPressable>
                <S.NavigateText onPress={() => handleFollow(pic.UserName)}>
                  {pic.UserName}
                </S.NavigateText>
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

      <ImageCasherDynamic
        photoFile={pic.photoFile}
        id={pic.id}
        style={{
          borderRadius: moderateScale(15),
          resizeMode: "cover"
        }}
      />
    </S.Container>
  );
};

export default Picture;
