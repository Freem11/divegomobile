import { TouchableOpacity, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { moderateScale } from "react-native-size-matters";
import {
  insertPhotoLike,
  deletePhotoLike
} from "../../../supabaseCalls/photoLikeSupabaseCalls";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { SelectedPictureContext } from "../../contexts/selectedPictureContext";
import ImageCasherDynamic from "../../helpers/imageCashingDynamic";
import email from "react-native-email";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import abbreviateNumber from "../../helpers/abbreviateNumber";
import ButtonIcon from "../../reusables/buttonIcon";
import * as S from "./styles";
import { SelectedPhotoContext } from "../../contexts/selectedPhotoContext";
import { windowWidth } from "../paginator/styles";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import IconCounterButton from "../iconCounterButton";

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
  const { profile } = useContext(UserProfileContext);
  const { setSelectedPicture } = useContext(SelectedPictureContext);
  const [picLiked, setPicLiked] = useState(pic.likedbyuser);
  const [likeData, setLikeData] = useState(pic.likeid);
  const [countOfLikes, setCountOfLikes] = useState(pic.likecount);

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

  const handleLike = async (picId: number) => {
    if (picLiked) {
      deletePhotoLike(likeData);
      setPicLiked(false);
      setCountOfLikes(countOfLikes - 1);
    } else {
      const newRecord = await insertPhotoLike(profile.UserID, pic.id);
      setPicLiked(true);
      setLikeData(newRecord[0].id);
      setCountOfLikes(countOfLikes + 1);
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
    <S.Container key={pic.id} style={{width: windowWidth - windowWidth * 0.07, aspectRatio: aspectRatio}}>
      <TouchableOpacity
        onPress={() => togglePhotoBoxModal(pic.photoFile)}
        style={{
          aspectRatio,
          overflow: 'hidden',
          borderRadius: moderateScale(10),
        }}
      >
        <ImageCasherDynamic
          photoFile={pic.photoFile}
          id={pic.id}
          aspectRatio={aspectRatio}
          style={{
            aspectRatio,
            resizeMode: 'cover',
          }}
        />
      </TouchableOpacity>
      <S.Overlay pointerEvents="box-none" />
  
        <S.TopContentWrapper>
          <ButtonIcon
            style={{width: moderateScale(20)}}
            onPress={() => handleEmail(pic)}
            icon="error-outline"
            size="micro"
          />
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
  
          <S.IconsWrapper>
            <IconCounterButton
              icon="like-hand"
              onPress={() => handleLike(pic.id)}
              size="icon"
              fillColor={picLiked ? "red" : null}
              count={abbreviateNumber(countOfLikes)}
            />
            <IconCounterButton
              icon="comment"
              onPress={() => handleCommentModal(pic)}
              size="icon"
              count={abbreviateNumber(pic.commentcount)}
            />
          </S.IconsWrapper>
        </S.ContentWrapper>
    </S.Container>
  );
  
};

export default SeaLifeImageCard;
