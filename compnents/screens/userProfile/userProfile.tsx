import React, { useState, useContext, useEffect } from "react";
import * as S from "./styles";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { SessionContext } from "../../contexts/sessionContext";
import { getProfilePhotosByUser } from "../../../supabaseCalls/photoSupabaseCalls";
import { updateProfile } from "../../../supabaseCalls/accountSupabaseCalls";
import { registerForPushNotificationsAsync } from "../../tutorial/notificationsRegistery";
import {
  insertUserFollow,
  deleteUserFollow
} from "../../../supabaseCalls/userFollowSupabaseCalls";
import { useTranslation } from "react-i18next";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import Icon from "../../../icons/Icon";
import Label from "../../reusables/label";
import { Photo } from "../../../entities/photos";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { Pagination } from "../../../entities/pagination";
import { colors } from "../../styles";

type UserProfileProps = {
  closeParallax?: (mapConfig: number) => void
  bottomHitCount?: number;
};

export default function UserProfileScreen({
  closeParallax,
  bottomHitCount,
}: UserProfileProps) {
  
  const { profile } = useContext(UserProfileContext);
  const { activeSession } = useContext(SessionContext);
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [isNotVisitor, setIsNotVisitor] = useState(true);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const [userFail, setUserFail] = useState("");
  const [profileVals, setProfileVals] = useState(null);
  const [visitProfileVals, setVisitProfileVals] = useState(null);
  const [tempUserName, setTempUserName] = useState("");
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [profilePhotos, setProfilePhotos] = useState(null);
  const [followData, setFollowData] = useState(profile.UserID);
  const [userFollows, setUserFollows] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const { t } = useTranslation()

  const getPhotos = async () => {

    const pagination = new Pagination({page: bottomHitCount, ipp: 10})

    let photos;
    if (selectedProfile?.UserID) {
      photos = await getProfilePhotosByUser(
        selectedProfile.UserID,
        profile.UserID,
        pagination
      );
    } else {
      photos = await getProfilePhotosByUser(
        profile.UserID,
        profile.UserID,
        pagination
      );
    }

    setProfilePhotos((prev) => prev ? [...prev, ...photos] : photos);
  };

  const getFollowStatus = async () => {
    if (!selectedProfile || selectedProfile?.UserID === profile[0].UserID) {
      setVisitProfileVals(null);
      setIsNotVisitor(true)
    } else {
      setIsNotVisitor(false)
      setVisitProfileVals({
        id: selectedProfile?.UserID,
        userName: selectedProfile?.UserName,
        bio: selectedProfile?.profileBio,
        photo: selectedProfile?.profilePhoto,
      });
    }

    setProfileVals({
      id: profile[0].UserID,
      userName: profile[0].UserName,
      bio: profile[0].profileBio,
      photo: profile[0].profilePhoto,
    });
    setTempUserName(profile[0].UserName);

  };

  useEffect(() => {
    getPhotos();
    getFollowStatus();
  }, [selectedProfile, bottomHitCount]);

  useEffect(() => {
    setUserFail("");

    if (!isEditModeOn && profileVals) {
      profileUpdate();
    }
  }, [isEditModeOn]);

  const profileUpdate = async () => {
    if (profileVals.userName === "") {
      setUserFail(t('Validators.requiredDiverName'));
      setProfileVals({ ...profileVals, userName: tempUserName });
    } else {
      try {
        const success = await updateProfile({
          id: profileVals.id,
          username: profileVals.userName,
          bio: profileVals.bio,
          photo: profileVals.profilePhoto,
        });
        if (success.length === 0 && profileVals) {
          setProfileVals({ ...profileVals, userName: tempUserName });
          setUserFail(t('Validators.userNameTaken'));
        }
      } catch (e) {
        setProfileVals({ ...profileVals, userName: tempUserName });
        setUserFail(t('Validators.userNameTaken'));
        console.log({ title: "Error19", message: e.message });
      }
    }
  };

  const handleFollow = async () => {

    let permissionGiven = await registerForPushNotificationsAsync(activeSession, "yes");
    if (!permissionGiven) {
      return
    }

    if (userFollows) {
      deleteUserFollow(followData);
      setUserFollows(false);
    } else {
      if (userStats) {
        let newRecord = await insertUserFollow(
          profile[0].UserID,
          userStats[0].userid
        );
        setFollowData(newRecord[0].id);
        setUserFollows(true);
      }
    }
  };

  const handleDiveSiteMove = async (pic: Photo, photoPacket) => {
    setSelectedDiveSite({
      SiteName: photoPacket.name,
      Latitude: pic.latitude,
      Longitude: pic.longitude
    });
    closeParallax(1)
    setLevelTwoScreen(false);
  };


  const groupedPhotos = {};

  profilePhotos && profilePhotos.forEach(photo => {
    const key = `${photo.divesitename}_${photo.dateTaken}`;
    if (!groupedPhotos[key]) {
      groupedPhotos[key] = {
        divesitename: photo.divesitename,
        dateTaken: photo.dateTaken,
        photos: [],
      };
    }
    groupedPhotos[key].photos.push(photo);
  });

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.UserNameContainer>
          <S.Header>{selectedProfile?.UserName}</S.Header>
        </S.UserNameContainer>
   
        <S.Content>{selectedProfile?.profileBio}</S.Content>

      </S.InputGroupContainer>

      <S.LabelWrapper>
            <Label label="Sea Life Sightings" />
        </S.LabelWrapper>
        
      {groupedPhotos && Object.values(groupedPhotos).map((photoPacket, index) => {
  return (
    <S.PhotoContainer key={`${photoPacket.id}-${index}`}>   
      <S.PacketHeader key={`${photoPacket.id}-${index}`}>
  
      <S.HeaderWrapper>
        <S.IconWrapper>
          <Icon name={'anchor'} fill={colors.primaryBlue}/>
        </S.IconWrapper>

          <S.PacketHeaderItem>{photoPacket.divesitename}</S.PacketHeaderItem>
      </S.HeaderWrapper>

      <S.HeaderWrapper>
        <S.IconWrapper>
          <Icon name={'calendar-month'} fill={colors.primaryBlue}/>
        </S.IconWrapper>

          <S.PacketHeaderItem>{photoPacket.dateTaken}</S.PacketHeaderItem>
      </S.HeaderWrapper>

      </S.PacketHeader>

      {photoPacket.photos.length > 0 &&
        photoPacket.photos.map((photo, index) => {
          return (
            <SeaLifeImageCard
              key={`${photo.id}-${index}`}
              pic={photo}
              dataSetType={"ProfilePhotos"}
              diveSiteName={photoPacket.name}
              diveSiteAction={() => handleDiveSiteMove(photo, photoPacket)}
            />
          );
        })}
    </S.PhotoContainer>
  );
})}
    </S.ContentContainer>
  );
}
